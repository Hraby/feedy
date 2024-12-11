import { BadRequestException, UseGuards } from "@nestjs/common";
import { Resolver, Args, Mutation, Query, ResolveReference, Context } from "@nestjs/graphql";
import { UsersService } from "./user.service";
import { LoginResponse, RegisterResponse } from "./types/user.types";
import { User } from "./entities/user.entity";
import { LoginDto, RegisterDto } from "./dto/user.dto";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args("registerInput") registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.firstName || !registerDto.lastName || !registerDto.password || !registerDto.email) {
      throw new BadRequestException("Please fill all the fields");
    }

    const result = await this.userService.register(registerDto, context.res);

    return {
      user: result.user,
      tokens: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    };
  }

  @Mutation(() => LoginResponse)
  async login(@Args("loginInput") loginDto: LoginDto): Promise<LoginResponse> {
    const result = await this.userService.login(loginDto);

    return {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }


  @ResolveReference()
  async resolveReference(reference: { id: number }): Promise<User> {
    return this.userService.findById(reference.id);
  }

  async getLoggedInUser(req: any) {
    const user = req.user;
    const refreshToken = req.refreshtoken;
    const accessToken = req.accesstoken;
    return { user, refreshToken, accessToken };
  }

  async Logout(req: any) {
    req.user = null;
    req.refreshtoken = null;
    req.accesstoken = null;
    return { message: 'Logged out successfully!' };
  }
}