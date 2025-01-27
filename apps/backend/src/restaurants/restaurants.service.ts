import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RestaurantsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
      ) {}

    async getRestaurants(){
    
    }


}
