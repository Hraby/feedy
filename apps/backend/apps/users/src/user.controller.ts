import { Controller, Get } from '@nestjs/common';
import { UsersService } from './user.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getHello(): string {
    return "Hello world";
  }
}
