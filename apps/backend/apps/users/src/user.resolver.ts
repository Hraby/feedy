import { BadRequestException, UseFilters } from "@nestjs/common";
import { Resolver, Args, Mutation, ResolveReference, Query } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { RegisterRepose } from "./types/user.types";
import { RegisterDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => RegisterRepose)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
  ): Promise<RegisterRepose> {
    if (!registerDto.firstName || !registerDto.lastName || !registerDto.password || !registerDto.email) {
      throw new BadRequestException('Please fill all the fields');
    }

    const user = await this.userService.register(registerDto);
    return { user };
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }

//   @ResolveReference()
//   async resolveReference(reference: { id: string }): Promise<User> {
//     return this.userService.findById(reference.id);
//   }
}