import { Body, Controller, Param, Patch, Post, UseGuards, Get } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Auth, GetUser } from 'src/auth/decorators';
import { CreateCourierDto } from './dto/create-courier.dto';
import { CourierService } from './courier.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

@Controller('courier')
export class CourierController {
    constructor(private readonly courierService: CourierService) {}

    @Get()
    @ApiOperation({
        summary: "Get couriers",
    })
    @Auth(Role.Admin, Role.Courier, Role.Customer, Role.Restaurant)
    getCouriers(){
        return this.courierService.getCouriers();
    }

    @Post("request")
    @ApiOperation({
        summary: "Request for a new courier",
    })
    @Auth(Role.Admin, Role.Courier, Role.Customer, Role.Restaurant)
    createCourier(@GetUser() user, @Body() createCourierDto: CreateCourierDto){
        return this.courierService.requestCourier(createCourierDto, user);
    }

    @Patch(":id/approve")
    @ApiOperation({
        summary: "Approve courier (admin only)",
    })
    @ApiResponse({status: 200, description: "Ok", type: User, isArray: true})
    @ApiResponse({status: 400, description: "Bad request" })
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 500, description: "Server error"})
    @Auth(Role.Admin)
    async approveCourier(@Param("id") id: string, @Body() body: { approve: boolean }) {
        return this.courierService.approveCourier(id, body.approve);
    }
}
