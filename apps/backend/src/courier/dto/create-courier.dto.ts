import { Language, VehicleType } from "@prisma/client";
import { IsDate, IsEnum, IsISO8601, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateCourierDto{
    @IsString()
    city: string;

    @IsEnum(VehicleType)
    vehicle: VehicleType;

    @IsEnum(Language)
    language: Language;

    @IsString()
    @IsISO8601()
    dateBirth: string;
}