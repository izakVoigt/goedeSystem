import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ResumesController } from "./resumes.controller";
import { ResumesService } from "./resumes.service";
import { Resumes } from "./model/resumes.model";
import { Departments } from "../departments/model/departments.model";

@Module({
  imports: [SequelizeModule.forFeature([Resumes, Departments])],
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule {}
