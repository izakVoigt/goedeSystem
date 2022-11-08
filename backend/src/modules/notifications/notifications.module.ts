import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { Notifications } from "./model/notifications.model";
import { Users } from "../users/model/users.model";

@Module({
  imports: [SequelizeModule.forFeature([Notifications, Users])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
