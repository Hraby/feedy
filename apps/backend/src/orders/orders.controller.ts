import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { OrdersService } from './orders.service';
import { Auth, GetUser } from 'src/auth/decorators/';
import { OrderStatus, Role } from "@prisma/client";
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order-dto';

@ApiBearerAuth()
@Controller('order')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get()
    @ApiOperation({ summary: "Get all orders" }) 
    @Auth(Role.Admin, Role.Courier)
    async getOrders(@Query("status") status?: string) {
        return this.ordersService.getOrders(status);
    }

    @Post()
    @ApiOperation({ summary: "Create new order" })
    @Auth(Role.Customer, Role.Admin)
    async createOrder(@Body() dto: CreateOrderDto, @GetUser() user: User) {
        return this.ordersService.createOrder(dto, user);
    }

    @Patch()
    @ApiOperation({ summary: "Update specific order" })
    @Auth(Role.Admin)
    async updateOrder(@Body() dto: UpdateOrderDto, @Param("id") id: string){
        return this.ordersService.updateOrder(id, dto);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get specific order" }) 
    @Auth(Role.Customer, Role.Restaurant, Role.Courier, Role.Admin)
    async getOrder(@Param("id") id: string) {
        return this.ordersService.getOrderById(id);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete order" }) 
    @Auth(Role.Admin)
    async deleteOrder(@Param("id") id: string) {
        return this.ordersService.deleteOrder(id);
    }

    @Get(":id/status")
    @ApiOperation({ summary: "Get specific order status" }) 
    @Auth(Role.Customer, Role.Restaurant, Role.Courier, Role.Admin)
    async getOrderStatus(@Param("id") id: string) {
        return this.ordersService.getOrderStatusById(id);
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
    @Auth(Role.Restaurant, Role.Admin)
    async cancelOrder(@Param("id") id: string) {
        return this.ordersService.updateOrderStatus(id, OrderStatus.Cancelled);
    }

    @Get("user/history")
    @ApiOperation({ summary: "Get order history for current user" })
    @Auth(Role.Customer, Role.Restaurant, Role.Courier, Role.Admin)
    async getUserOrderHistory(@GetUser() user: User, @Query("status") status?: string) {
        return this.ordersService.getUserOrderHistory(user.id, status as OrderStatus);
    }

    @Get("restaurant/orders")
    @ApiOperation({ summary: "Get orders for restaurant" })
    @Auth(Role.Restaurant)
    async getRestaurantOrders(@GetUser() user: User, @Query("status") status?: string) {
        return this.ordersService.getRestaurantOrders(user.id, status);
    }

    @Get("courier/deliveries")
    @ApiOperation({ summary: "Get courier delivery history" })
    @Auth(Role.Courier)
    async getCourierDeliveries(@GetUser() user: User, @Query("status") status?: string) {
        return this.ordersService.getCourierDeliveries(user.id, status);
    }
}
