import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

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

    async requestRestaurant(dto: CreateRestaurantDto, user: User) {
      return this.prisma.restaurant.create({
          data: {
              name: dto.name,
              description: dto.description,
              phone: dto.phone,
              ownerId: user.id,
              status: "Pending",
              address: {
                  create: {
                      street: dto.address.street,
                      city: dto.address.city,
                      zipCode: dto.address.zipCode,
                      country: dto.address.country,
                  },
              },
          },
      });
    }

    async getRestaurantById(id: string) {
      return this.prisma.restaurant.findUnique({
        where: { id },
        include: { menuItems: true, address: true },
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

    async updateRestaurant(id: string, dto: UpdateRestaurantDto, user: User) {
      const restaurant = await this.prisma.restaurant.findUnique({ where: { id } });

      if (!restaurant) {
          throw new NotFoundException("Restaurant not found");
      }

      if (restaurant.ownerId !== user.id) {
          throw new ForbiddenException("You are not the owner of this restaurant");
      }

      return this.prisma.restaurant.update({
          where: { id },
          data: { ...dto },
      });
    }

    async deleteRestaurant(id: string) {
      const restaurant = await this.prisma.restaurant.findUnique({ where: { id } });

      if (!restaurant) {
          throw new NotFoundException("Restaurant not found");
      }

      return this.prisma.restaurant.delete({
          where: { id },
      });
    }

    async getRestaurantMenu(id: string){
      const restaurant = await this.prisma.restaurant.findUnique({ where: { id } });

      if (!restaurant) {
          throw new NotFoundException("Restaurant not found");
      }

      return this.prisma.restaurant.findUnique({
          where: { id },
          include: { menuItems: true, address: true },
      });
    }

    async createMenuItem(restaurantId: string, dto: CreateMenuItemDto, user: User) {
      const restaurant = await this.prisma.restaurant.findUnique({
          where: { id: restaurantId },
      });

      if (!restaurant) {
          throw new NotFoundException("Restaurant not found");
      }

      if (restaurant.ownerId !== user.id) {
          throw new ForbiddenException("You are not the owner of this restaurant");
      }

      return this.prisma.menuItem.create({
        data: {
            name: dto.name,
            description: dto.description,
            price: dto.price,
            imageUrl: dto.imageUrl,
            restaurantId: restaurant.id,
        },
      });
    }

    async updateMenuItem(restaurantId: string, menuItemId: string, dto: UpdateMenuItemDto, user: User) {
      const restaurant = await this.prisma.restaurant.findUnique({
          where: { id: restaurantId },
      });

      if (!restaurant) {
          throw new NotFoundException("Restaurant not found");
      }

      if (restaurant.ownerId !== user.id) {
          throw new ForbiddenException("You are not the owner of this restaurant");
      }

      const menuItem = await this.prisma.menuItem.findUnique({
          where: { id: menuItemId },
      });

      if (!menuItem) {
          throw new NotFoundException("Menu item not found");
      }

      return this.prisma.menuItem.update({
          where: { id: menuItemId },
          data: {
              name: dto.name,
              description: dto.description,
              price: dto.price,
              imageUrl: dto.imageUrl,
          },
      });
    }

    async deleteMenuItem(restaurantId: string, menuItemId: string, user: User) {
      const restaurant = await this.prisma.restaurant.findUnique({
          where: { id: restaurantId },
      });

      if (!restaurant) {
          throw new NotFoundException("Restaurant not found");
      }

      if (restaurant.ownerId !== user.id) {
          throw new ForbiddenException("You are not the owner of this restaurant");
      }

      const menuItem = await this.prisma.menuItem.findUnique({
          where: { id: menuItemId },
      });

      if (!menuItem) {
          throw new NotFoundException("Menu item not found");
      }

      return this.prisma.menuItem.delete({
          where: { id: menuItemId },
      });
    }

}
