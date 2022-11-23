import * as fs from "fs-extra";
import { BadRequestException, Injectable, NotFoundException, StreamableFile } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Response } from "express";
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

    return data;
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

  async file(response: Response, id: number) {
    const resume = await this.resumesModel.findByPk(id);

    if (!resume) throw new NotFoundException("Currículo não encontrado");

    const fileBuffer = await fs.readFile(resume.filePath);

    response.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=`Currículo - ${resume.name}.pdf`",
    });

    return new StreamableFile(fileBuffer);
  }

  async list(page: number, limit: number, name?: string, iDepartment?: string) {
    if (!page) {
      return new BadRequestException("Informe o número da página");
    }
    if (!limit) {
      return new BadRequestException("Informe o limite de resultados na página");
    }

    const offset = (page - 1) * limit;

    if (name && iDepartment) {
      const list = await this.resumesModel.findAll({
        where: { iDepartment, [Op.and]: { name: { [Op.like]: `%${name}%` } } },
        attributes: ["id", "name"],
        order: [["name", "ASC"]],
        limit: limit,
        offset: offset,
      });

      return list;
    }
    if (name) {
      const list = await this.resumesModel.findAll({
        where: { name: { [Op.like]: `%${name}%` } },
        attributes: ["id", "name"],
        order: [["name", "ASC"]],
        limit: limit,
        offset: offset,
      });

      return list;
    }
    if (iDepartment) {
      const list = await this.resumesModel.findAll({
        where: { iDepartment },
        attributes: ["id", "name"],
        order: [["name", "ASC"]],
        limit: limit,
        offset: offset,
      });

      return list;
    }

    const list = await this.resumesModel.findAll({ attributes: { include: ["id", "name"] } });

    return list;
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
