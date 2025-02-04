import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [OrdersService],
  controllers: [OrdersController],
  imports: [
    AuthModule,
    PrismaModule,
  ],
})
export class OrdersModule {}
