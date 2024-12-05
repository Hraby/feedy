import { BadRequestException, UseFilters, UseGuards } from "@nestjs/common";
import { Resolver, Args, Mutation, ResolveReference, Query } from "@nestjs/graphql";
import { UsersService } from "./user.service";
import { LoginRepose, RegisterRepose } from "./types/user.types";
import { LoginDto, RegisterDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";
import { GqlAuthGuard } from "./auth/gql-auth.guard";

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

  @Mutation(() => LoginRepose)
  async login(@Args('loginInput') loginDto: LoginDto): Promise<LoginRepose> {
    return this.userService.login(loginDto);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }

  @ResolveReference()
  async resolveReference(reference: { id: number }): Promise<User> {
    return this.userService.findById(reference.id);
  }
}