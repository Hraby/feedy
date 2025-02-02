import { IsString, IsOptional, IsPhoneNumber, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { AddressDto } from "./address.dto";

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsPhoneNumber("CZ")
  phone: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}