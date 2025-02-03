import { Role } from "@prisma/client";
import { IsEmail, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    firstName?: string;
  
    @IsOptional()
    @IsString()
    lastName?: string;
  
    @IsOptional()
    @IsEmail()
    email?: string;
  
    @IsOptional()
    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/, { message: "Password must contain at least one number" })
    password?: string;

    @IsString()
    @IsOptional()
    role?: Role;
  }