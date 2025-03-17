import { Country } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';

export class AddressDto {
    @IsString()
    @IsNotEmpty()
    street: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    zipCode?: string;

    @IsEnum(Country)
    country?: Country;
}

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    restaurantId: string;

    @IsArray()
    items: {
        menuItemId: string;
        quantity: number;
        price: number;
    }[];

    @IsObject()
    @ValidateNested()
    @Type(() => AddressDto)
    address: AddressDto;
}
