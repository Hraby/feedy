import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsEmail, MinLength } from "class-validator";

@InputType()
export class RegisterCustomerDto {
    @Field()
    @IsNotEmpty({ message: "Name is required." })
    @IsString({ message: "Name must be string." })
    name: string;

    @Field()
    @IsNotEmpty({ message: "Password is required." })
    @MinLength(8, { message: "Password must be at least 8 characters." })
    password: string;

    @Field()
    @IsNotEmpty({ message: "Email is required." })
    @IsEmail({}, { message: "Email is invalid." })
    email: string;

    @Field({ nullable: true })
    phoneNumber?: string;
}

@InputType()
export class LogitCustomerDto{
    @Field()
    @IsNotEmpty({message: "Email is required."})
    @IsEmail({}, {message: "Email must be valid."})
    email: string;

    @Field()
    @IsNotEmpty({message: "Password is required"})
    password:string;
}