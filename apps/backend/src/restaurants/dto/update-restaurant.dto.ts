import { IsOptional, IsString, IsNotEmpty } from "class-validator";

export class UpdateRestaurantDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    phone?: string;
}
