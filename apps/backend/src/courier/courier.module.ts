import { Module } from '@nestjs/common';
import { CourierController } from './courier.controller';
import { CourierService } from './courier.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CourierController],
  providers: [CourierService],
  imports: [
    AuthModule,
    PrismaModule,
  ]
})
export class CourierModule {}
