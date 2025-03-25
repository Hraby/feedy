import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { LoginDto } from "src/users/dto/user.dto";
import { Auth, GetUser } from "./decorators";
import { User } from "src/users/entities/user.entity";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    @ApiResponse({status: 201, description: "Ok"})          
    @ApiResponse({status: 400, description: "Bad request"})
    @ApiResponse({status: 500, description: "Server error"})
    async register(@Body() registerDto: RegisterDto) {
        return await this.authService.registerUser(registerDto);
    }

    @Post("login")
    @ApiResponse({status: 200, description: "Ok"})
    @ApiResponse({status: 400, description: "Bad request"})     
    @ApiResponse({status: 500, description: "Server error"})
    async login(@Res() response, @Body() loginDto: LoginDto) {
        const data = await this.authService.loginUser(loginDto.email, loginDto.password);
        response.status(HttpStatus.OK).send(data);
    }

    @Post("refresh-token")
    @UseGuards(AuthGuard("jwt-refresh"))
    @ApiResponse({status: 200, description: "Ok"})
    @ApiResponse({status: 401, description: "Unauthorized"})
    async refreshToken(@GetUser() user: User, @Req() req: Request){
        return this.authService.refreshToken(user.id);
    }
}
