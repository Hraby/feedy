import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RestaurantsModule } from "./restaurants/restaurants.module";
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "../.env"
    }),
    UsersModule,
    AuthModule,
    PrismaModule,
    RestaurantsModule,
    OrdersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}