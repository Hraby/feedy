import { Role } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEmail, IsEnum, IsObject, IsOptional, IsString, Matches, MinLength, ValidateNested } from "class-validator";
import { AddressDto } from "src/restaurants/dto/address.dto";

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

    @IsArray()
    @IsEnum(Role, { each: true })
    role?: Role[];

    @Type(() => AddressDto)
    address?: AddressDto;
  }