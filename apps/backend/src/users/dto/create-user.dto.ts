import { Role } from "@prisma/client";
import { IsEmail, IsOptional, IsString, Matches, MinLength } from "class-validator";

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

    @IsString()
    @IsOptional()
    role?: Role;
}