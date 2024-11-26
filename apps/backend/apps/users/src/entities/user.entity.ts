import { ObjectType, Field, Directive } from "@nestjs/graphql";

@ObjectType()
export class User{
    @Field()
    id: string;

    @Field()
    fistName: string;

    @Field()
    lastName: string;

    @Field()
    password: string;

    @Field()
    email: string;
}