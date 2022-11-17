import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateDepartmentDto, UpdateDepartmentPatchDto, UpdateDepartmentPutDto } from "./dto";
import { Departments } from "./model/departments.model";

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Departments)
    private departmentModel: typeof Departments,
  ) {}

  async create(Cdto: CreateDepartmentDto) {
    const { description, name } = Cdto;

    const departmentExists = await this.departmentModel.findOne({ where: { name } });

    if (departmentExists) throw new BadRequestException("Departamento já existente");

    await this.departmentModel.create({
      description,
      name,
    });

    return { message: "Departamento criado com sucesso" };
  }

  async data(id: number) {
    const data = await this.departmentModel.findByPk(id);

    if (!data) throw new NotFoundException("Departamento não encontrado");

    return { data };
  }

  async destroy(id: number) {
    const department = await this.departmentModel.findByPk(id);

    if (!department) throw new NotFoundException("Departamento não encontrado");

    await this.departmentModel.destroy({ where: { id } });

    return { message: "Departamento excluído com sucesso" };
  }

  async list() {
    const list = await this.departmentModel.findAll({ attributes: ["name"], order: [["name", "ASC"]] });

    return { list };
  }

  async updatePatch(id: number, Udto: UpdateDepartmentPatchDto) {
    const { description, name } = Udto;

    const department = await this.departmentModel.findByPk(id);

    if (!department) throw new NotFoundException("Departamento não encontrado");

    if (name) {
      const departmentNameExists = await this.departmentModel.findOne({ where: { name } });

      if (departmentNameExists) throw new BadRequestException("Departamento já existente");
    }

    await this.departmentModel.update(
      {
        description,
        name,
      },
      { where: { id } },
    );

    return { message: "Departamento alterado com sucesso" };
  }

  async updatePut(id: number, Udto: UpdateDepartmentPutDto) {
    const { description, name } = Udto;

    const department = await this.departmentModel.findByPk(id);

    if (!department) throw new NotFoundException("Departamento não encontrado");

    const departmentNameExists = await this.departmentModel.findOne({ where: { name } });

    if (departmentNameExists) throw new BadRequestException("Departamento já existente");

    await this.departmentModel.update(
      {
        description,
        name,
      },
      { where: { id } },
    );

    return { message: "Departamento alterado com sucesso" };
  }
}
