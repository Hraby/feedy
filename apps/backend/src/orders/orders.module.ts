import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrdersGateway } from './orders.gateway';

@Module({
  providers: [OrdersService, OrdersGateway],
  controllers: [OrdersController],
  imports: [
    AuthModule,
    PrismaModule,
    EventEmitterModule.forRoot(),
  ],
  exports: [OrdersService, OrdersGateway],
})
export class OrdersModule {}