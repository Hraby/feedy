import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtStrategy } from "src/common/strategies/jwt.strategy";
import { ConfigModule } from "@nestjs/config";
import jwtConfig from "./config/jwt.config";
import refreshConfig from "./config/refresh.config";
import { RefreshTokenStrategy } from "../common/strategies/refresh-token.strategy";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy],
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
    PrismaModule,
  ],
  exports: [JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
