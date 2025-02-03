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
  
    @IsOptional()
    @IsUrl()
    imageUrl?: string;
  }