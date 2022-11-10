import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Users } from "../users/model/users.model";
import { ContactsController } from "./contacts.controller";
import { ContactsService } from "./contacts.service";

@Module({
  imports: [SequelizeModule.forFeature([Users])],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
