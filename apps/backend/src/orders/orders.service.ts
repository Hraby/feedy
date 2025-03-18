import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { City, Country, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
      ) {}

    async getOrders(status?: string) {
        const statusArray = status ? status.split(',') as OrderStatus[] : undefined;

        const data = this.prisma.order.findMany({
            where: {
                status: statusArray ? { in: statusArray } : undefined,
            },
            orderBy: { updatedAt: "desc" },
            include: { user: true, restaurant: true, CourierProfile: true, orderItems: {
                include: {
                    menuItem: true
                }
            }
        } 
        });

        return data
    }

    async getOrderById(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { user: {
                include: {
                    address: true,
                },
            }, restaurant: {
                include: {
                    address: true,
                },
            }, CourierProfile: true, orderItems: {
                include: {
                    menuItem: true
                }
            } 
            }
        });
        if (!order) throw new NotFoundException("Order not found");
        return order;
    }

    async getOrderStatusById(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            select: { status: true }
        });
        
        if (!order) throw new NotFoundException("Order not found");
        return order;
    }

    async createOrder(dto: CreateOrderDto, user) {
        let address = await this.prisma.address.findUnique({
            where: { userId: user.id }
        });
    
        if (!address) {
            address = await this.prisma.address.create({
                data: {
                    userId: user.id,
                    street: dto.address.street,
                    city: dto.address.city as City,
                    zipCode: dto.address.zipCode,
                    country: dto.address.country || Country.Czechia,
                }
            });
        }
    
        return this.prisma.order.create({
            data: {
                userId: user.id,
                restaurantId: dto.restaurantId,
                status: OrderStatus.Pending,
                orderItems: {
                    create: dto.items.map(item => ({
                        menuItemId: item.menuItemId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                user: {
                    include: {
                        address: true,
                    }
                },
                restaurant: true,
            }
        });
    }

    async getUserOrderHistory(userId: string, status?: OrderStatus){
        const statusArray = status ? status.split(',') as OrderStatus[] : undefined;

        const data = this.prisma.order.findMany({
            where: {
                status: statusArray ? { in: statusArray } : undefined,
                userId: userId,
            },
            orderBy: { updatedAt: "desc" },
            include: { user: true, restaurant: true, CourierProfile: true, orderItems: {
                include: {
                    menuItem: true
                }
            }
        } 
        });

        return data
    }

    async getRestaurantOrders(userId: string, status?: string) {
        const statusArray = status ? status.split(',') as OrderStatus[] : undefined;

        const restaurants = await this.prisma.restaurant.findMany({
            where: { ownerId: userId }
        });
        
        const restaurantIds = restaurants.map(restaurant => restaurant.id);
    
        const data = await this.prisma.order.findMany({
            where: {
                status: statusArray ? { in: statusArray } : undefined,
                restaurantId: { in: restaurantIds }
            },
            orderBy: { updatedAt: "desc" },
            include: { 
                user: true, 
                restaurant: true, 
                CourierProfile: true, 
                orderItems: {
                    include: {
                        menuItem: true
                    }
                }
            }
        });
    
        return data;
    }

    async getCourierDeliveries(userId: string, status?: string) {
        const courierProfile = await this.prisma.courierProfile.findUnique({
            where: { userId: userId }
        });
        
        if (!courierProfile) {
            throw new NotFoundException('Courier profile not found for this user');
        }
        
        const statusArray = status ? status.split(',') as OrderStatus[] : undefined;
        
        const data = await this.prisma.order.findMany({
            where: {
                status: statusArray ? { in: statusArray } : undefined,
                courierProfileId: courierProfile.id,
            },
            orderBy: { updatedAt: "desc" },
            include: { 
                user: true, 
                restaurant: true, 
                CourierProfile: true, 
                orderItems: {
                    include: {
                        menuItem: true
                    }
                }
            }
        });
    
        return data;
    }
    

    async updateOrderStatus(orderId: string, status: OrderStatus) {
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        return updatedOrder;
    }

    async assignCourier(id: string) {
        const availableCourier = await this.prisma.user.findFirst({
            where: { 
                role: {
                    has: "Courier"
                }
            },
        });

        if (!availableCourier) throw new NotFoundException("No couriers available");

        return this.prisma.order.update({
            where: { id },
            data: { courierProfileId: availableCourier.id, status: OrderStatus.OutForDelivery },
        });
    }

    async claimOrder(orderId: string, userId: string) {
        const courierProfile = await this.prisma.courierProfile.findUnique({
            where: { userId }
        });
    
        if (!courierProfile) {
            throw new Error("Courier profile not found");
        }
    
        return this.prisma.order.update({
            where: { id: orderId },
            data: { 
                courierProfileId: courierProfile.id, 
                status: OrderStatus.CourierPickup
            },
        });
    }
    

}
