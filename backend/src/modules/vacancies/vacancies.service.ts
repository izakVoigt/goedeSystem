import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { CreateVacancyDto, UpdateVacancyPatchDto, UpdateVacancyPutDto } from "./dto";
import { Departments } from "../departments/model/departments.model";
import { Vacancies } from "./model/vacancies.model";

@Injectable()
export class VacanciesService {
  constructor(
    @InjectModel(Vacancies)
    private vacanciesModel: typeof Vacancies,
    @InjectModel(Departments)
    private departmentsModel: typeof Departments,
  ) {}

  async create(Cdto: CreateVacancyDto) {
    const departmentExists = await this.departmentsModel.findByPk(Cdto.iDepartment);

    if (!departmentExists) throw new NotFoundException("Departamento não encontrado");

    await this.vacanciesModel.create({
      description: Cdto.description,
      iDepartment: Cdto.iDepartment,
      requirements: Cdto.requirements,
      title: Cdto.title,
    });

    return { message: "Vaga criada com sucesso" };
  }

  async data(id: number) {
    const data = await this.vacanciesModel.findByPk(id);

    if (!data) throw new NotFoundException("Vaga não encontrada");

    return { data };
  }

  async destroy(id: number) {
    const vacancy = await this.vacanciesModel.findByPk(id);

    if (!vacancy) throw new NotFoundException("Vaga não encontrada");

    await this.vacanciesModel.destroy({ where: { id: id } });

    return { message: "Vaga excluída com sucesso" };
  }

  async list() {
    const list = await this.vacanciesModel.findAll({ order: [["title", "ASC"]] });

    return { list };
  }

  async updatePatch(id: number, Udto: UpdateVacancyPatchDto) {
    const vacancy = await this.vacanciesModel.findByPk(id);

    if (!vacancy) throw new NotFoundException("Vaga não encontrada");

    if (Udto.iDepartment) {
      const departmentExists = await this.departmentsModel.findByPk(Udto.iDepartment);

      if (!departmentExists) throw new NotFoundException("Departamento não encontrado");
    }

    await this.vacanciesModel.update(
      {
        description: Udto.description,
        iDepartment: Udto.iDepartment,
        requirements: Udto.requirements,
        title: Udto.title,
      },
      { where: { id } },
    );

    return {
      message: "Vaga alterada com sucesso",
    };
  }

  async updatePut(id: number, Udto: UpdateVacancyPutDto) {
    const vacancy = await this.vacanciesModel.findByPk(id);

    if (!vacancy) throw new NotFoundException("Vaga não encontrada");

    const departmentExists = await this.departmentsModel.findByPk(Udto.iDepartment);

    if (!departmentExists) throw new NotFoundException("Departamento não encontrado");

    await this.vacanciesModel.update(
      {
        description: Udto.description,
        iDepartment: Udto.iDepartment,
        requirements: Udto.requirements,
        title: Udto.title,
      },
      { where: { id } },
    );

    return {
      message: "Vaga alterada com sucesso",
    };
  }
}
