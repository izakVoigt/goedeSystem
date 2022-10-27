import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { DepartmentsController } from "./departments.controller";
import { DepartmentsService } from "./departments.service";
import { Departments } from "./model/departments.model";

@Module({
  imports: [SequelizeModule.forFeature([Departments])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
})
export class DepartmentsModule {}
