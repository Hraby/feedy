import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtStrategy } from "src/common/strategies/jwt.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get("JWT_SECRET_KEY"),
          signOptions: {
            expiresIn: "15m"
          }
        }
      }
    }),
    PrismaModule,
  ],
  exports: [JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
