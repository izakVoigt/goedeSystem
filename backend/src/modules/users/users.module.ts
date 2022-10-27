import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { Users } from "./model/users.model";
import { Departments } from "../departments/model/departments.model";

@Module({
  imports: [SequelizeModule.forFeature([Users, Departments])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
