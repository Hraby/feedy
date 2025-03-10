import { BadRequestException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import { RegisterUserDto } from "src/users/dto/user.dto";
import { User } from "src/users/entities/user.entity";
import refreshConfig from "./config/refresh.config";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private readonly jwtService: JwtService,
        private configService: ConfigService
    ) { }

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

            const tokens = await this.generateTokens({id: user.id, firstName: user.firstName, lastName: user.lastName, role: user.role});
            await this.updateRefreshToken(user.id, tokens.refreshToken);

            return {
                user: user,
                ...tokens
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

        const tokens = await this.generateTokens({id: user.id, firstName: user.firstName, lastName: user.lastName, role: user.role});
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return{
            user,
            ...tokens
        };
    }

    async generateTokens(payload: { id: string, firstName: string, lastName: string, role: string }) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                id: payload.id,
                name: payload.firstName+" "+payload.lastName,
                role: payload.role
            }, {
                secret: this.configService.get("JWT_SECRET_KEY"), expiresIn: "15m"
            }),
            this.jwtService.signAsync({
                id: payload.id,
                name: payload.firstName+" "+payload.lastName,
                role: payload.role
            }, {
                secret: this.configService.get("JWT_REFRESH_SECRET"), expiresIn: "7d"
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async validateJwtUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
        if (!user) throw new UnauthorizedException("User not found!");
        const currentUser = { id: user.id, name: user.firstName+" "+user.lastName, role: user.role };
        return currentUser;
    }

    async validateRefreshToken(userId: string, refreshToken: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
        if (!user) throw new UnauthorizedException("User not found!");
    
        const refreshTokenMatched = await bcrypt.compare(
          user.hashedRefreshToken,
          refreshToken,
        );
    
        if (!refreshTokenMatched)
          throw new UnauthorizedException("Invalid Refresh Token!");

        const currentUser = { id: user.id, name: user.firstName+" "+user.lastName, role: user.role };
        return currentUser;
    }

    async refreshToken(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, firstName: true, lastName: true, role: true, hashedRefreshToken: true },
        });
        console.log("test")

        if (!user || !user.hashedRefreshToken) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        const tokens = await this.generateTokens({id: user.id, firstName: user.firstName, lastName: user.lastName, role: user.role});
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    private async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedToken = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRefreshToken: hashedToken },
        });
    }
}