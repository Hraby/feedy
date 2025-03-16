import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly eventEmitter: EventEmitter2,
      ) {}

    async getOrders(status?: string) {
        const statusArray = status ? status.split(',') as OrderStatus[] : undefined;

        return this.prisma.order.findMany({
            where: {
                status: statusArray ? { in: statusArray } : undefined,
            },
            orderBy: { updatedAt: "desc" },
        });
    }

    async getOrderById(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { user: true, restaurant: true, CourierProfile: true }
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
                user: true,
                restaurant: true
            }
        });
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

    async claimOrder(id: string, courierId: string) {
        return this.prisma.order.update({
            where: { id },
            data: { courierProfileId: courierId, status: OrderStatus.OutForDelivery },
        });
    }

}
