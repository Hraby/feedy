import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import { RegisterUserDto } from "src/users/dto/user.dto";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private readonly jwtService: JwtService) { }

    async registerUser(dto: RegisterUserDto): Promise<any> {
        const { email, password, firstName, lastName } = dto;

        const existingUser = await this.prisma.user.findUnique({where: { email }});
        if (existingUser) {
            throw new BadRequestException("User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        try{
            const user = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    role: "Customer",
                }
            });

            return {
                user: user,
                token: this.getToken({id: user.id, firstName: user.firstName, lastName: user.lastName, role: user.role})
            };
        } catch(error){
            throw new InternalServerErrorException("Server error");
        }
    
    }

    async loginUser(email: string, password: string): Promise<any>{
        let user: User;
        try{
            user = await this.prisma.user.findUniqueOrThrow({
                where: {
                    email
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    password: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });
        } catch(error){
            throw new BadRequestException("Wrong email or password");
        }

        const passValidation = await bcrypt.compare(password, user.password);

        if(!passValidation){
            throw new BadRequestException("Wrong email or password");
        }

        delete user.password;

        return{
            user,
            token: this.getToken({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            })
        };
    }

    async refreshToken(user: User){
        return {
            user: user,
            token: this.getToken({id: user.id, firstName: user.firstName, lastName: user.lastName, role: user.role})
        };
    }

    private getToken(payload: { id: string, firstName: string, lastName: string, role: string }): string {
        const token = this.jwtService.sign({
            id: payload.id,
            name: payload.firstName+" "+payload.lastName,
            role: payload.role
        });
        return token;
    }
}
