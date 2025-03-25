import { Language, VehicleType } from "@prisma/client";
import { IsDate, IsEnum, IsISO8601, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class UpdateCourierDto{
    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsEnum(VehicleType)
    vehicle?: VehicleType;

    @IsOptional()
    @IsEnum(Language)
    language?: Language;

    @IsOptional()
    @IsString()
    @IsISO8601()
    dateBirth?: string;
}