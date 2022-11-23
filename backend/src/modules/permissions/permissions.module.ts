import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PermissionsController } from "./permissions.controller";
import { PermissionsService } from "./permissions.service";
import { Permissions } from "./model/permissions.model";
import { Users } from "../users/model/users.model";

@Module({
  imports: [SequelizeModule.forFeature([Permissions, Users])],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
