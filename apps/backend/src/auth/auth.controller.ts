import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { LoginResponse } from './responses/login';
import { LoginDto } from 'src/users/dto/user.dto';
import { Auth, GetUser } from './decorators';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    @ApiResponse({status: 201, description: "Ok", type: LoginResponse})          
    @ApiResponse({status: 400, description: "Bad request"})
    @ApiResponse({status: 500, description: "Server error"})
    register(@Body() registerDto: RegisterDto) {
        return this.authService.registerUser(registerDto);
    }

    @Post("login")
    @ApiResponse({status: 200, description: "Ok", type: LoginResponse})
    @ApiResponse({status: 400, description: "Bad request"})     
    @ApiResponse({status: 500, description: "Server error"})
    async login(@Res() response, @Body() loginDto: LoginDto) {
        const data = await this.authService.loginUser(loginDto.email, loginDto.password);
        response.status(HttpStatus.OK).send(data);
    }

    @Get("refresh-token")
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: "Ok", type: LoginResponse})
    @ApiResponse({status: 401, description: "Unauthorized"})
    @Auth()
    refreshToken(@GetUser() user: User){
        return this.authService.refreshToken(user);
    }
}
