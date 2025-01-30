import { IsEmail, IsString } from "class-validator";

export class AddressDto {
    @IsString()
    street: string;
  
    @IsString()
    city: string;
  
    @IsString()
    zipCode: string;
  
    @IsString()
    country: string;
}