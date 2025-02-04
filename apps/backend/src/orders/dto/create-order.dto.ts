import { IsArray, IsNotEmpty, IsString } from 'class-validator';

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
}