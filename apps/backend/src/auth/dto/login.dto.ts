import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/, {message: "Password must contain at least one number"})
    password: string;
}