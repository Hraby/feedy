import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RestaurantsModule } from "./restaurants/restaurants.module";
import { OrdersModule } from './orders/orders.module';
import { CourierModule } from './courier/courier.module';
import { AppController } from './app.controller';

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
    CourierModule,
  ],
  controllers: [AuthController, AppController],
  providers: [AuthService],
})
export class AppModule {}