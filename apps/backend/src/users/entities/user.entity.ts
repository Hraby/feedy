import { ObjectType, Field, ID, Resolver, Query, Directive } from "@nestjs/graphql";
import { UsersService } from "../users.service";
import { Role } from "@prisma/client";

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  password?: string;

  @Field()
  role: Role[];

  @Field()
  refreshToken?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async getUsers() {
    return this.usersService.getUsers();
  }
}