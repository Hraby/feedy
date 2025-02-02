import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsUrl } from "class-validator";

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
  @IsUrl()
  imageUrl?: string;
}