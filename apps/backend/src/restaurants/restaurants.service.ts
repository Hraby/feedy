import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RestaurantsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
      ) {}

    async getRestaurants(){
      return this.prisma.restaurant.findMany({
        where: { status: "Approved" },
      });
    }

    async requestRestaurant(dto: CreateRestaurantDto, user: User){
      return this.prisma.restaurant.create({
        data: {
          name: dto.name,
          description: dto.description,
          phone: dto.phone,
          ownerId: user.id,
          status: "Pending",
        },
      });
    }

    async getRestaurantById(id: string) {
      return this.prisma.restaurant.findUnique({
        where: { id },
        include: { menuItems: true },
      });
    }

    async approveRestaurant(id: string, approve: boolean) {
      return this.prisma.restaurant.update({
        where: { id },
        data: {
          status: approve ? "Approved" : "Rejected",
        },
      });
    }
    

}
