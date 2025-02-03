import { Module } from "@nestjs/common";
import { RestaurantsController } from "./restaurants.controller";
import { RestaurantsService } from "./restaurants.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  imports: [
    AuthModule,
    PrismaModule,
  ],
})
export class RestaurantsModule {}
