import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsUrl, IsBoolean } from "class-validator";

export class UpdateMenuItemDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsBoolean()
  available: boolean;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}