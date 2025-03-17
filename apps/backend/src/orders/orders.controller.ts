import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { OrdersService } from './orders.service';
import { Auth, GetUser } from 'src/auth/decorators/';
import { OrderStatus, Role } from "@prisma/client";
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get()
    @ApiOperation({ summary: "Get all orders" }) 
    @Auth(Role.Admin, Role.Courier)
    async getOrders(@Query("status") status?: string) {
        return this.ordersService.getOrders(status);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get specific order" }) 
    @Auth(Role.Customer, Role.Restaurant, Role.Courier, Role.Admin)
    async getOrder(@Param("id") id: string) {
        return this.ordersService.getOrderById(id);
    }

    @Get(":id/status")
    @ApiOperation({ summary: "Get specific order status" }) 
    @Auth(Role.Customer, Role.Restaurant, Role.Courier, Role.Admin)
    async getOrderStatus(@Param("id") id: string) {
        return this.ordersService.getOrderStatusById(id);
    }

    @Post()
    @ApiOperation({ summary: "Create new order" })
    @Auth(Role.Customer, Role.Admin)
    async createOrder(@Body() dto: CreateOrderDto, @GetUser() user: User) {
        return this.ordersService.createOrder(dto, user);
    }

    @Patch(":id/prepare")
    @ApiOperation({ summary: "Mark order as preparing (restaurant only)" })
    @Auth(Role.Restaurant)
    async prepareOrder(@Param("id") id: string) {
        return this.ordersService.updateOrderStatus(id, OrderStatus.Preparing);
    }

    @Patch(":id/ready")
    @ApiOperation({ summary: "Mark order as ready for pickup (restaurant only)" })
    @Auth(Role.Restaurant)
    async readyForPickup(@Param("id") id: string) {
        return this.ordersService.updateOrderStatus(id, OrderStatus.Ready);
    }

    @Patch(":id/assign")
    @ApiOperation({ summary: "Assign order to a courier (system auto-assign)" })
    @Auth(Role.Admin)
    async assignCourier(@Param("id") id: string) {
        return this.ordersService.assignCourier(id);
    }

    @Patch(":id/claim")
    @ApiOperation({ summary: "Courier claims an available order" })
    @Auth(Role.Courier)
    async claimOrder(@Param("id") id: string, @GetUser() courier: User) {
        return this.ordersService.claimOrder(id, courier.id);
    }

    @Patch(":id/pickup")
    @ApiOperation({ summary: "Courier picks up order" })
    @Auth(Role.Courier)
    async pickupOrder(@Param("id") id: string) {
        return this.ordersService.updateOrderStatus(id, OrderStatus.OutForDelivery);
    }

    @Patch(":id/deliver")
    @ApiOperation({ summary: "Mark order as delivered" })
    @Auth(Role.Courier)
    async deliverOrder(@Param("id") id: string) {
        return this.ordersService.updateOrderStatus(id, OrderStatus.Delivered);
    }

    @Patch(":id/cancel")
    @ApiOperation({ summary: "Cancel order (customer before acceptance)" })
    @Auth(Role.Customer)
    async cancelOrder(@Param("id") id: string) {
        return this.ordersService.updateOrderStatus(id, OrderStatus.Cancelled);
    }
}
