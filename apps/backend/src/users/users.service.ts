import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RegisterUserDto, LoginDto } from "./dto/user.dto";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { City, Role } from "@prisma/client";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async updateUser(id: string, updateUserDto: UpdateUserDto, user: User){
    if (id !== user.id && !user.role.includes("Admin")) {
      throw new UnauthorizedException("Unauthorized");
    }

    if (updateUserDto.role) {
      const invalidRoles = updateUserDto.role.filter(r => !Object.values(Role).includes(r));
      if (invalidRoles.length > 0) {
          throw new BadRequestException(`Invalid roles: ${invalidRoles.join(", ")}`);
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    try{
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          address: updateUserDto.address
            ? {
                update: {
                  street: updateUserDto.address.street,
                  city: updateUserDto.address.city as City,
                  zipCode: updateUserDto.address.zipCode,
                  country: "Czechia",
                },
              }
            : undefined,
          role: updateUserDto.role ? { set: updateUserDto.role } : undefined,
        },
        include: {
          address: true,
        },
      });
      
      return updatedUser;
    } catch(error){
      throw new InternalServerErrorException("Server error");
    }
  }
 
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  
  async createUser(data: CreateUserDto) {
    if (data.role && !data.role.every(role => Object.values(Role).includes(role))) throw new BadRequestException("Invalid role");

    data.email = data.email.toLowerCase().trim();

    const hashPass = await bcrypt.hash(data.password, 10);

    data.password = hashPass;

    try {
      const user = await this.prisma.user.create({
        data: data,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
        }
      });

      return user;
      
    } catch (error) {
      throw new InternalServerErrorException("Server error");
    }
  }
  
  async getUsers(){
    return this.prisma.user.findMany()
  }

  async findById(id: string, user: User){
    if (id !== user["id"] && !user.role.includes("Admin")) throw new UnauthorizedException("Unauthorized");

    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      } 
    });
  }

  async deleteUser(id: string, user: User){
    if (id !== user["id"] && !user.role.includes("Admin")) throw new UnauthorizedException("Unauthorized");

    try {
      await this.prisma.user.delete({
        where: {id},
      });
      return {message: "User deleted"}
      
    } catch (error) {
      throw new InternalServerErrorException("Server error");
    }

  }
}
