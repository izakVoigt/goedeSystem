import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { VacanciesController } from "./vacancies.controller";
import { VacanciesService } from "./vacancies.service";
import { Vacancies } from "./model/vacancies.model";
import { Departments } from "../departments/model/departments.model";

@Module({
  imports: [SequelizeModule.forFeature([Vacancies, Departments])],
  controllers: [VacanciesController],
  providers: [VacanciesService],
})
export class VacanciesModule {}
