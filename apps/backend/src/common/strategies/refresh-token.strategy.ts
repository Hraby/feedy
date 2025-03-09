import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(private prisma: PrismaService, private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("JWT_REFRESH_SECRET"),
            passReqToCallback: false,
        });
    }

    async validate(payload: any): Promise<User> {
        const { id } = payload;
        try{
            const user : User = await this.prisma.user.findUniqueOrThrow({
                where: {id},
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });
            return user;

        }catch (error) {
            throw new UnauthorizedException("Invalid token");
        }
    }
}