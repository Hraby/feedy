import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsEmail, MinLength, IsPhoneNumber, IsDateString } from "class-validator";

@InputType()
export class RegisterCourierDto {
    @Field()
    @IsNotEmpty({ message: "First name is required." })
    @IsString({ message: "First name must be a string." })
    firstName: string;

    @Field()
    @IsNotEmpty({ message: "Last name is required." })
    @IsString({ message: "Last name must be a string." })
    lastName: string;

    @Field()
    @IsNotEmpty({ message: "Email is required." })
    @IsEmail({}, { message: "Invalid email format." })
    email: string;

    @Field()
    @IsNotEmpty({ message: "Date of birth is required." })
    @IsDateString({}, { message: "Date of birth must be a valid date string." })
    dateOfBirth: string;

    @Field()
    @IsNotEmpty({ message: "Phone number is required." })
    @IsPhoneNumber("CZ", { message: "Invalid phone number format." })
    phoneNumber: string;

    @Field()
    @IsNotEmpty({ message: "Country is required." })
    @IsString({ message: "Country must be a string." })
    country: string;

    @Field()
    @IsNotEmpty({ message: "City is required." })
    @IsString({ message: "City must be a string." })
    city: string;

    @Field()
    @IsNotEmpty({ message: "Delivery vehicle type is required." })
    @IsString({ message: "Delivery vehicle type must be a string." })
    vehicleType: string;
}

export class LoginCourierDTO {
    @Field()
    @IsNotEmpty({message: "Email is required."})
    @IsEmail({}, {message: "Email must be valid."})
    email: string;

    @Field()
    @IsNotEmpty({message: "Password is required"})
    password:string;
}