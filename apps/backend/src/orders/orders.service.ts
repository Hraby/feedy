import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/users/entities/user.entity';
import { OrderStatus } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly eventEmitter: EventEmitter2,
      ) {}

      async getOrders() {
        return this.prisma.order.findMany({
            include: { customer: true, restaurant: true, courier: true }
        });
    }

    async getOrderById(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { customer: true, restaurant: true, courier: true }
        });
        if (!order) throw new NotFoundException("Order not found");
        return order;
    }

    async createOrder(dto: CreateOrderDto, customer) {
        return this.prisma.order.create({
            data: {
                customerId: customer.id,
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
        });
    }

    async updateOrderStatus(orderId: string, status: OrderStatus) {
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        this.eventEmitter.emit('order.updated', { orderId, status });

        return updatedOrder;
    }

    async assignCourier(id: string) {
        const availableCourier = await this.prisma.user.findFirst({
            where: { role: "Courier" },
        });

        if (!availableCourier) throw new NotFoundException("No couriers available");

        return this.prisma.order.update({
            where: { id },
            data: { courierId: availableCourier.id, status: OrderStatus.OutForDelivery },
        });
    }

    async claimOrder(id: string, courierId: string) {
        return this.prisma.order.update({
            where: { id },
            data: { courierId, status: OrderStatus.OutForDelivery },
        });
    }

}
