    import { Injectable } from '@nestjs/common';
    import { PassportStrategy } from '@nestjs/passport';
    import { ExtractJwt, Strategy } from 'passport-jwt';
    import { UsersService } from "./user.service";

    @Injectable()
    export class JwtStrategy extends PassportStrategy(Strategy) {
        constructor(private usersService: UsersService) {
            super({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: false,
                secretOrKey: process.env.JWT_SECRET_KEY,
            });
        }

        async validate(payload: any) {
            return { userId: payload.sub, email: payload.email };
        }
    }