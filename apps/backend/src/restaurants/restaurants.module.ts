import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  imports: [PrismaModule],
})
export class RestaurantsModule {}
