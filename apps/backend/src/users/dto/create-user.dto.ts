import { Role } from "@prisma/client";
import { IsArray, IsEmail, IsEnum, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    firstName: string;
  
    @IsString()
    lastName: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/, { message: "Password must contain at least one number" })
    password: string;

    @IsArray()
    @IsEnum(Role, { each: true })
    role?: Role[];
}