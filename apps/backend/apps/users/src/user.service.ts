import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/user.dto';
import { User } from "./entities/user.entity"
import { PrismaService } from '../../../prisma/Prisma.service';
import { TokenSender } from "./utils/sendToken";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}


  async register(registerDto: RegisterDto, response: Response) {
    const { email, password, firstName, lastName } = registerDto;

    const existingUser = await this.prisma.user.findUnique({where: { email }});
    if (existingUser) {
      throw new BadRequestException("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: "User",
      }
    });

    const tokens = await this.generateTokens(user);

    return {user, ...tokens};
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      throw new UnauthorizedException("Invalid email");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    const tokenSender = new TokenSender(this.configService, this.jwtService);
    return tokenSender.sendToken(user);

  }

  private async generateTokens(user: User) {
    const accessToken = this.jwtService.sign({ userId: user.id }, {
      secret: this.configService.get<string>("JWT_SECRET_KEY"),
      expiresIn: "15m",
    });

    const refreshToken = this.jwtService.sign({ userId: user.id }, {
      secret: this.configService.get<string>("JWT_REFRESH_KEY"),
      expiresIn: "30d", 
    });

    return { accessToken, refreshToken };
  }
 
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  
  async createUser(data: RegisterDto) {
    return this.prisma.user.create({ data });
  }
  
  async getUsers(){
    return this.prisma.user.findMany()
  }

  async findById(id: number){
    return this.prisma.user.findUnique({where: { id } });
  }

}
