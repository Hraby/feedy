import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { RegisterDto, LoginDto } from './dto/user.dto';
import { PrismaService } from '../../../prisma/Prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  // register user
  async register(registerDto: RegisterDto) {
    const {firstName, lastName, email, password} = registerDto;
    const user = {
      firstName,
      lastName,
      email,
      password,
    };
    return user;
  }

  // login user
  async Login(loginDto: LoginDto) {
    const {email, password} = loginDto;
    const user = {
      email,
      password,
    };
    return user;
  }

  async getUsers() {
    return this.prisma.user.findMany({});
  }

  async findById(id: number){
    return this.prisma.user.findUnique({
      where: {
        id: id,
      }
    })
  }
}
