import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './users.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import { PrismaService } from 'prisma/Prisma.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: true,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, JwtService, PrismaService],
})
export class UsersModule {}
