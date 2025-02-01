import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { Role } from '@prisma/client';
import { User } from 'src/users/entities/user.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Controller('restaurant')
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) {}

    @Get()
    @ApiOperation({
        summary: "Get all restaurants",
    }) 
    @ApiResponse({status: 200, description: "Ok", type: User, isArray: true})
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 403, description: "Forbidden" })
    @ApiResponse({status: 500, description: "Server error"})         
    getRestaurants() {
        return this.restaurantsService.getRestaurants();
    }

    @Post()
    @ApiOperation({
        summary: "Create restaurant (admin only)",
    })
    @ApiResponse({status: 200, description: "Ok", type: User, isArray: true})
    @ApiResponse({status: 400, description: "Bad request" })
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 500, description: "Server error"})
    @Auth(Role.Admin)
    // ToDo: Create restaurant controller + service
    createRestaurant(){
    }

    @Get(":id")
    @ApiOperation({
        summary: "Get restaurant by id",
    })
    async getRestaurant(@Param("id") id: string) {
       return this.restaurantsService.getRestaurantById(id);
    }

    @Post("request")
    @ApiOperation({
        summary: "Request for a new restaurant",
    })
    @ApiResponse({status: 200, description: "Ok", type: User, isArray: true})
    @ApiResponse({status: 400, description: "Bad request" })
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 500, description: "Server error"})
    @Post("request")
    @Auth(Role.Customer)
    async requestRestaurant(@Body() dto: CreateRestaurantDto, @GetUser() user: User) {
      return this.restaurantsService.requestRestaurant(dto, user);
    }

    @Patch(":id/approve")
    @Auth(Role.Admin)
    async approveRestaurant(@Param("id") id: string, @Body() body: { approve: boolean }) {
        return this.restaurantsService.approveRestaurant(id, body.approve);
    }


}
