import { Controller, Get } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';
import { Role } from '@prisma/client';
import { User } from 'src/users/entities/user.entity';

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
    @Auth(Role.Admin)
    getRestaurants() {
        return this.restaurantsService.getRestaurants();
    }

}
