import { Body, Controller, Get, Param, Patch, Post, Delete} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from "./entities/user.entity";
import { Auth, GetUser } from 'src/auth/decorators';
import { Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: "Get all users",
  })
  @ApiResponse({status: 200, description: "Ok", type: User, isArray: true})
  @ApiResponse({status: 401, description: "Unauthorized"})
  @ApiResponse({status: 403, description: "Forbidden" })
  @ApiResponse({status: 500, description: "Server error"})         
  @Auth(Role.Admin)
  getUsers() {
    return this.usersService.getUsers();
  }

  @Post()
  @ApiOperation({
    summary: "Create user (admin only)",
  })
  @ApiResponse({status: 200, description: "Ok", type: User, isArray: true})
  @ApiResponse({status: 400, description: "Bad request" })
  @ApiResponse({status: 401, description: "Unauthorized"})
  @ApiResponse({status: 500, description: "Server error"})
  @Auth(Role.Admin)
  createUser(@Body() createUserDto: CreateUserDto){
    return this.usersService.createUser(createUserDto);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get user by id",
  })
  @ApiResponse({status: 200, description: "Ok", type: User, isArray: true})
  @ApiResponse({status: 401, description: "Unauthorized"})
  @ApiResponse({status: 403, description: "Forbidden" })
  @ApiResponse({status: 500, description: "Server error"})
  @Auth(Role.Admin, Role.Customer, Role.Courier, Role.Restaurant)
  getUser(@Param("id") id: string, @GetUser() user: User){
    return this.usersService.findById(id, user);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update user by id",
  })
  @ApiResponse({status: 200, description: "Ok", type: User, isArray: true})
  @ApiResponse({status: 400, description: "Bad request" })
  @ApiResponse({status: 401, description: "Unauthorized"})
  @ApiResponse({status: 500, description: "Server error"})
  @Auth(Role.Admin, Role.Customer, Role.Courier, Role.Restaurant)
  updateUser(@Param("id") id:string, @Body() updateUserDto: UpdateUserDto, @GetUser() user: User){
    return this.usersService.updateUser(id, updateUserDto, user);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete user by id (admin only)",
  })
  @ApiOkResponse({content: {"application/json": {example: {"message": "User deleted"}}}})
  @ApiResponse({status: 400, description: "Bad request" })
  @ApiResponse({status: 401, description: "Unauthorized"})
  @ApiResponse({status: 500, description: "Server error"})
  @Auth(Role.Admin, Role.Customer, Role.Courier, Role.Restaurant)
  deleteUser(@Param("id") id:string, @GetUser() user: User){
    return this.usersService.deleteUser(id, user);
  }
}
