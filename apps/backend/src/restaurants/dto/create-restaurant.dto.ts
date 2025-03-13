import { IsString, IsOptional, IsPhoneNumber, ValidateNested, isString, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { AddressDto } from "./address.dto";
import { Category } from "@prisma/client";

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  category?: Category[];

  @IsPhoneNumber("CZ")
  phone: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}