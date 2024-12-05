import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/user.dto';
import { PrismaService } from '../../../prisma/Prisma.service';
import * as bcrypt from 'bcrypt';

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

    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) throw new Error("User with this mail already exist");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    return user;
  }

  // login user
  async login(loginDto: LoginDto) {
    const {email, password} = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new Error('Invalid credentials (email not found)');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials (wrong password)');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken,
    };
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

  async findOneByEmail(email : string){
    return this.prisma.user.findUnique({
      where: {
        email: email,
      }
    })
  }
}
