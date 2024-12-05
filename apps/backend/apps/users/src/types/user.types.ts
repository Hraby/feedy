import { ObjectType, Field } from "@nestjs/graphql";
import { User } from "../entities/user.entity";

@ObjectType()
export class ErrorType {
    @Field()
    message: string;

    @Field({nullable: true})
    code?: string
}

@ObjectType()
export class RegisterRepose {
    @Field(() => User, {nullable: true})
    user?: User | any;

    @Field(() => String, {nullable: true})
    id?: string;

    @Field(() => String, {nullable: true})
    firstName?: string;

    @Field(() => String, {nullable: true})
    lastName?: string;

    @Field(() => String, {nullable: true})
    email?: string;

    @Field(() => String, {nullable: true})
    role?: string;

    @Field(() => Date, {nullable: true})
    createdAt?: Date;

    @Field(() => Date, {nullable: true})
    updatedAt?: Date;

    @Field(() => ErrorType, {nullable: true})
    error?: ErrorType;
}

@ObjectType()
export class LoginRepose {
  @Field(() => User, { nullable: true })
  user?: Partial<User>;

  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}