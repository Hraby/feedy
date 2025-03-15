import { Transform } from "class-transformer";
import { IsOptional, IsString, IsNotEmpty, IsNumber, IsBoolean, IsPositive, IsUrl } from "class-validator";

export class CreateMenuItemDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsNumber()
    @IsPositive()
    price: number;

    @IsString()
    category: string;

    @IsBoolean()
    available: boolean;
  
    @IsOptional()
    @IsUrl()
    imageUrl?: string;
}