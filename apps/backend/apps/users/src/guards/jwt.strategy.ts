import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from "../user.service";
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService, private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("JWT_SECRET_KEY"),
        });
    }

    async validate(payload: any) {
        const { email } = payload;
        const user : User = await this.usersService.findUserByEmail(email);

        if (!user){
            throw new UnauthorizedException("User not found");
        }

        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}