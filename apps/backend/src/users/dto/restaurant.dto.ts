import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, MinLength } from "class-validator";

@InputType()
export class RegisterRestaurantDto {
    @Field()
    @IsNotEmpty({ message: "Company name is required." })
    @IsString({ message: "Company name must be a string." })
    companyName: string;

    @Field()
    @IsNotEmpty({ message: "Business identification number (ICO) is required." })
    @IsString({ message: "ICO must be a string." })
    ico: string;

    @Field()
    @IsNotEmpty({ message: "Number of branches is required." })
    @IsNumber({}, { message: "Number of branches must be a number." })
    branchCount: number;

    @Field()
    @IsNotEmpty({ message: "Branch name is required." })
    @IsString({ message: "Branch name must be a string." })
    branchName: string;

    @Field()
    @IsNotEmpty({ message: "Street is required." })
    @IsString({ message: "Street must be a string." })
    street: string;

    @Field()
    @IsNotEmpty({ message: "Postal code is required." })
    @IsString({ message: "Postal code must be a string." })
    postalCode: string;

    @Field()
    @IsNotEmpty({ message: "City is required." })
    @IsString({ message: "City must be a string." })
    city: string;

    @Field()
    @IsNotEmpty({ message: "Country is required." })
    @IsString({ message: "Country must be a string." })
    country: string;

    @Field()
    @IsNotEmpty({ message: "Contact first name is required." })
    @IsString({ message: "Contact first name must be a string." })
    contactFirstName: string;

    @Field()
    @IsNotEmpty({ message: "Contact last name is required." })
    @IsString({ message: "Contact last name must be a string." })
    contactLastName: string;

    @Field()
    @IsNotEmpty({ message: "Contact phone number is required." })
    @IsPhoneNumber("CZ", { message: "Invalid phone number format." })
    contactPhoneNumber: string;

    @Field()
    @IsNotEmpty({ message: "Contact email is required." })
    @IsEmail({}, { message: "Invalid email format." })
    contactEmail: string;
}

@InputType()
export class LoginRestaurantDto{
    @Field()
    @IsNotEmpty({message: "Email is required."})
    @IsEmail({}, {message: "Email must be valid."})
    email: string;

    @Field()
    @IsNotEmpty({message: "Password is required"})
    password:string;
}
