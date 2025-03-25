import { Body, Controller, Param, Patch, Post, UseGuards, Get, Delete } from '@nestjs/common';
import { ApprovalStatus, CourierStatus, Role } from '@prisma/client';
import { Auth, GetUser } from 'src/auth/decorators';
import { CreateCourierDto } from './dto/create-courier.dto';
import { CourierService } from './courier.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { UpdateCourierDto } from './dto/update-courier.dto';

@ApiBearerAuth()
@Controller('courier')
export class CourierController {
    constructor(private readonly courierService: CourierService) {}

    @Get()
    @ApiOperation({
        summary: "Get couriers",
    })
    @ApiResponse({status: 200, description: "Ok"})
    @ApiResponse({status: 400, description: "Bad request" })
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 500, description: "Server error"})
    @Auth(Role.Admin, Role.Courier, Role.Customer, Role.Restaurant)
    getCouriers(){
        return this.courierService.getCouriers();
    }

    @Post("request")
    @ApiOperation({
        summary: "Request for a new courier",
    })
    @ApiResponse({status: 200, description: "Ok"})
    @ApiResponse({status: 400, description: "Bad request" })
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 500, description: "Server error"})
    @Auth(Role.Admin, Role.Courier, Role.Customer, Role.Restaurant)
    createCourier(@GetUser() user, @Body() createCourierDto: CreateCourierDto){
        return this.courierService.requestCourier(createCourierDto, user);
    }

    @Patch(":id")
    @ApiOperation({
        summary: "Update specific courier",
    })
    @ApiResponse({status: 200, description: "Ok"})
    @ApiResponse({status: 400, description: "Bad request" })
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 500, description: "Server error"})
    @Auth(Role.Admin)
    updateCourier(@GetUser() user, @Body() updateCourierDto: UpdateCourierDto){
        return this.courierService.updateCourier(updateCourierDto, user);
    }

    @Delete(":id")
    @ApiOperation({
        summary: "Delete specific courier",
    })
    @ApiResponse({status: 200, description: "Ok"})
    @ApiResponse({status: 400, description: "Bad request" })
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 500, description: "Server error"})
    @Auth(Role.Admin)
    deleteCourier(@Param("id") id:string){
        return this.courierService.deleteCourier(id);
    }

    @Patch(":id/approve")
    @ApiOperation({
        summary: "Approve courier (admin only)",
    })
    @ApiResponse({status: 200, description: "Ok"})
    @ApiResponse({status: 400, description: "Bad request" })
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 500, description: "Server error"})
    @Auth(Role.Admin)
    async approveCourier(@Param("id") id: string, @Body() body: { status: ApprovalStatus }) {
        return this.courierService.approveCourier(id, body.status);
    }

    @Patch(":id/status")
    @ApiOperation({
        summary: "Change courier status (available, bussy, offline)",
    })
    @ApiResponse({status: 200, description: "Ok"})
    @ApiResponse({status: 400, description: "Bad request" })
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 500, description: "Server error"})
    @Auth(Role.Courier)
    async updateCourierStatus(@Param("id") id: string, @Body() body: { status: CourierStatus }) {
        return this.courierService.updateStatus(id, body.status);
    }
}
