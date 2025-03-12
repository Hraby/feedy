import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { City, Country, RestaurantStatus, Role } from '@prisma/client';

@Injectable()
export class RestaurantsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
      ) {}

    async getRestaurants(){
      return this.prisma.restaurant.findMany({
        include: {
            owner: true,
        }
      });
    }

    async requestRestaurant(dto: CreateRestaurantDto, user: User) {
        const restaurantProfile = await this.prisma.restaurantProfile.findUnique({
            where: {
                userId: user.id
            }
        });

        let restaurantProfileId: string;
        if (!restaurantProfile) {
            const newProfile = await this.prisma.restaurantProfile.create({
                data: {
                    userId: user.id,
                    city: dto.address.city,
                }
            });
            restaurantProfileId = newProfile.id;
        } else {
            restaurantProfileId = restaurantProfile.id;
        }

        return this.prisma.restaurant.create({
            data: {
                name: dto.name,
                description: dto.description,
                phone: dto.phone,
                ownerId: user.id,
                status: "Pending",
                restaurantProfileId: restaurantProfileId,
                address: {
                    create: {
                        street: dto.address.street,
                        city: dto.address.city as City,
                        zipCode: dto.address.zipCode,
                        country: dto.address.country as Country,
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

    async approveRestaurant(id: string, status: RestaurantStatus) {
        const restaurant = await this.prisma.restaurant.findFirst({
            where: {
                id: id
            },
            include: {
                owner: true
            }
        })

        const user = await this.prisma.user.findUnique({
            where: { id: restaurant.owner.id },
            select: { role: true },
        });
          
        if (!user) {
            throw new Error("User not found");
        }
          
        if (status === "Approved") {
            if (!user.role.includes(Role.Restaurant)) {
                await this.prisma.user.update({
                    where: { id: restaurant.owner.id },
                    data: {
                        role: {
                        push: Role.Restaurant,
                        },
                    },
                });
            }
            } else {
            if (user.role.includes(Role.Restaurant)) {
                await this.prisma.user.update({
                    where: { id: restaurant.owner.id },
                    data: {
                        role: {
                        set: user.role.filter(r => r !== Role.Restaurant),
                        },
                    },
                });
            }
        }

        return this.prisma.restaurant.update({
            where: { id },
            data: {
                status: status,
            },
        });
    }

    async updateRestaurant(id: string, dto: UpdateRestaurantDto, user: User) {
      const restaurant = await this.prisma.restaurant.findUnique({ where: { id } });

      if (!restaurant) {
          throw new NotFoundException("Restaurant not found");
      }

      if (restaurant.ownerId !== user.id || !user.role.includes("Admin")) {
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
