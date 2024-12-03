import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, isNotEmpty, IsString, MinLength } from "class-validator";

@InputType()
export class RegisterDto {
    @Field()
    @IsNotEmpty({ message: "First name is required."})
    @IsString({message: "First name must be string."})
    firstName: string;

    @Field()
    @IsNotEmpty({ message: "Last name is required."})
    @IsString({message: "Last name must be string."})
    lastName: string;

    @Field()
    @IsNotEmpty({ message: "Password is required."})
    @MinLength(8, {message: "Password must be at least 8 chars."})
    password: string;

    @Field()
    @IsNotEmpty({message: "Email is required."})
    @IsEmail({}, {message: "Email is invalid."})
    email: string;
}

@InputType()
export class LoginDto{
    @Field()
    @IsNotEmpty({message: "Email is required."})
    @IsEmail({}, {message: "Email must be valid."})
    email: string;

    @Field()
    @IsNotEmpty({message: "Password is required"})
    password:string;
}