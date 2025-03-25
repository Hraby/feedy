

import { Country, Language, VehicleType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsISO8601, IsObject, IsOptional, IsPhoneNumber, IsString, ValidateNested } from "class-validator";

export class AddressDto {
    @IsOptional()
    @IsString()
    street?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    zipCode?: string;

    @IsOptional()
    @IsEnum(Country)
    country?: Country;
}

export class UpdateOrderDto {
    @IsOptional()
    @IsString()
    restaurantId?: string;

    @IsOptional()
    @IsArray()
    items?: {
        menuItemId?: string;
        quantity?: number;
        price?: number;
    }[];

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => AddressDto)
    address?: AddressDto;
}