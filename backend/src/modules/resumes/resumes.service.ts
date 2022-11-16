import * as fs from "fs-extra";
import { Injectable, NotFoundException, StreamableFile } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateResumeDto, UpdateResumePatchDto, UpdateResumePutDto } from "./dto";
import { Departments } from "../departments/model/departments.model";
import { Resumes } from "./model/resumes.model";

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Departments)
    private departmentsModel: typeof Departments,
    @InjectModel(Resumes)
    private resumesModel: typeof Resumes,
  ) {}

  async create(file: Express.Multer.File, Cdto: CreateResumeDto) {
    const { email, iDepartment, name, phone } = Cdto;

    const deparmentExists = await this.departmentsModel.findByPk(iDepartment);

    if (!deparmentExists) {
      throw new NotFoundException("Departamento não encontrado");
    }

    await this.resumesModel.create({
      email,
      filePath: file.path,
      iDepartment,
      name,
      phone,
      revised: false,
    });

    return { message: "Currículo cadastrado com sucesso" };
  }

  async data(id: number) {
    const data = await this.resumesModel.findByPk(id, { attributes: { exclude: ["filePath"] } });

    if (!data) {
      throw new NotFoundException("Currículo não encontrado");
    }

    return { data };
  }

  async destroy(id: number) {
    const resume = await this.resumesModel.findByPk(id);

    if (!resume) {
      throw new NotFoundException("Currículo não encontrado");
    }

    fs.remove(resume.filePath);

    await this.resumesModel.destroy({ where: { id } });

    return { message: "Currículo excluído com sucesso" };
  }

  async file(id: number) {
    const resume = await this.resumesModel.findByPk(id);

    if (!resume) throw new NotFoundException("Currículo não encontrado");

    const file = await fs.readFile(resume.filePath);

    return new StreamableFile(file);
  }

  async list() {
    const list = await this.resumesModel.findAll({ attributes: { exclude: ["filePath"] } });

    return { list };
  }

  async updatePatch(id: number, Udto: UpdateResumePatchDto) {
    const { iDepartment, observations, revised } = Udto;

    const resume = await this.resumesModel.findByPk(id);

    if (!resume) throw new NotFoundException("Currículo não encontrado");

    if (iDepartment) {
      const deparmentExists = await this.departmentsModel.findByPk(iDepartment);

      if (!deparmentExists) throw new NotFoundException("Departamento não encontrado");
    }

    await this.resumesModel.update(
      {
        iDepartment,
        observations,
        revised,
      },
      { where: { id } },
    );

    return { message: "Currículo alterado com sucesso" };
  }

  async updatePut(id: number, Udto: UpdateResumePutDto) {
    const { iDepartment, observations, revised } = Udto;

    const resume = await this.resumesModel.findByPk(id);

    if (!resume) throw new NotFoundException("Currículo não encontrado");

    const deparmentExists = await this.departmentsModel.findByPk(iDepartment);

    if (!deparmentExists) throw new NotFoundException("Departamento não encontrado");

    await this.resumesModel.update(
      {
        iDepartment,
        observations,
        revised,
      },
      { where: { id } },
    );

    return { message: "Currículo alterado com sucesso" };
  }
}
