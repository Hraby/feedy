import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { RestaurantsService } from "./restaurants.service";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Auth, GetUser } from "src/auth/decorators";
import { RestaurantStatus, Role } from "@prisma/client";
import { User } from "src/users/entities/user.entity";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";

@Controller("restaurant")
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
    @Auth(Role.Customer, Role.Admin, Role.Courier, Role.Restaurant)  
    async getRestaurants() {
        return this.restaurantsService.getRestaurants();
    }

    @Get(":id")
    @ApiOperation({
        summary: "Get restaurant by id",
    })
    @ApiResponse({status: 200, description: "Ok", type: User, isArray: true})
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 403, description: "Forbidden" })
    @ApiResponse({status: 500, description: "Server error"})  
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
    @Auth(Role.Customer, Role.Admin, Role.Courier, Role.Restaurant)
    async requestRestaurant(@Body() dto: CreateRestaurantDto, @GetUser() user: User) {
      return this.restaurantsService.requestRestaurant(dto, user);
    }

    @Patch(":id/approve")
    @ApiOperation({
        summary: "Approve restaurant (admin only)",
    })
    @ApiResponse({status: 200, description: "Ok", type: User, isArray: true})
    @ApiResponse({status: 400, description: "Bad request" })
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 500, description: "Server error"})
    @Auth(Role.Admin)
    async approveRestaurant(@Param("id") id: string, @Body() body: { status: RestaurantStatus }) {
        return this.restaurantsService.approveRestaurant(id, body.status);
    }

    @Patch(":id")
    @ApiOperation({ summary: "Update restaurant (owner only)" })
    @ApiResponse({ status: 200, description: "Updated successfully" })
    @ApiResponse({ status: 403, description: "Forbidden" })
    @ApiResponse({ status: 404, description: "Restaurant not found" })
    @Auth(Role.Restaurant, Role.Admin)
    async updateRestaurant(@Param("id") id: string, @Body() dto: UpdateRestaurantDto, @GetUser() user: User) {
        return this.restaurantsService.updateRestaurant(id, dto, user);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete restaurant (admin only)" })
    @ApiResponse({ status: 200, description: "Deleted successfully" })
    @ApiResponse({ status: 404, description: "Restaurant not found" })
    @Auth(Role.Admin)
    async deleteRestaurant(@Param("id") id: string) {
        return this.restaurantsService.deleteRestaurant(id);
    }

    @Get(":id/menu")
    @ApiOperation({ summary: "Get restaurant menu" })
    @ApiResponse({ status: 200, description: "Deleted successfully" })
    @ApiResponse({ status: 404, description: "Restaurant not found" })
    async getRestaurantMenu(@Param("id") id: string){
        return this.restaurantsService.getRestaurantMenu(id);
    }

    @Post(":id/menu")
    @ApiOperation({
        summary: "Create restaurant menu item",
    })
    @ApiResponse({status: 200, description: "Ok", type: User, isArray: true})
    @ApiResponse({status: 400, description: "Bad request" })
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 500, description: "Server error"})
    @Auth(Role.Restaurant)
    async createMenuItem(@Param("id") id: string, @Body() dto: CreateMenuItemDto, @GetUser() user: User){
        return this.restaurantsService.createMenuItem(id, dto, user);
    }

    @Patch(":id/menu/:menuItemId")
    @ApiOperation({
        summary: "Update restaurant menu item",
    })
    @ApiResponse({status: 200, description: "Ok", type: User, isArray: true})
    @ApiResponse({status: 400, description: "Bad request" })
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 500, description: "Server error"})
    @Auth(Role.Restaurant)
    async updateMenuItem(@Param("id") id: string, @Param("menuItemId") menuItemId: string, @Body() dto: UpdateMenuItemDto, @GetUser() user: User){
        return this.restaurantsService.updateMenuItem(id, menuItemId, dto, user);
    }

    @Delete(":id/menu/:menuItemId")
    @ApiOperation({
        summary: "Delete restaurant menu item",
    })
    @ApiResponse({status: 200, description: "Ok", type: User, isArray: true})
    @ApiResponse({status: 400, description: "Bad request" })
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 500, description: "Server error"})
    @Auth(Role.Restaurant)
    async deleteMenuItem(@Param("id") id: string, @Param("menuItemId") menuItemId: string, @GetUser() user: User){
        return this.restaurantsService.deleteMenuItem(id, menuItemId, user);
    }

}
