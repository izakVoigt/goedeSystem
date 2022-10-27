import * as argon from "argon2";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { CreateUserDto, UpdateUserPatchDto, UpdateUserPutDto } from "./dto";
import { Departments } from "../departments/model/departments.model";
import { Users } from "./model/users.model";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users)
    private usersModel: typeof Users,
    @InjectModel(Departments)
    private departmentsModel: typeof Departments,
  ) {}

  async create(Cdto: CreateUserDto) {
    const userExists = await this.usersModel.findOne({ where: { email: Cdto.email } });

    if (userExists) throw new BadRequestException("E-mail já em uso");

    const departmentExists = await this.departmentsModel.findByPk(Cdto.iDepartment);

    if (!departmentExists) throw new NotFoundException("Departamento não encontrado");

    const hash = await argon.hash(Cdto.password);

    await this.usersModel.create({
      active: true,
      address: Cdto.address,
      addressCity: Cdto.addressCity,
      addressDistrict: Cdto.addressDistrict,
      addressNumber: Cdto.addressNumber,
      addressState: Cdto.addressState,
      addressZipCode: Cdto.addressZipCode,
      birthDate: new Date(Cdto.birthDate),
      cpf: Cdto.cpf,
      email: Cdto.email,
      hireDate: new Date(Cdto.hireDate),
      iDepartment: Cdto.iDepartment,
      name: Cdto.name,
      office: Cdto.office,
      password: hash,
      permAccounting: Cdto.permAccounting,
      permAdmin: Cdto.permAdmin,
      permCorporate: Cdto.permCorporate,
      permFinances: Cdto.permFinances,
      permHuman: Cdto.permHuman,
      permMarketing: Cdto.permMarketing,
      permOversee: Cdto.permOversee,
      phone: Cdto.phone,
    });

    return { message: "Usuário criado com sucesso" };
  }

  async data(id: number) {
    const data = await this.usersModel.findByPk(id, { attributes: { exclude: ["password"] } });

    if (!data) throw new NotFoundException("Usuário não encontrado");

    return { data };
  }

  async destroy(id: number) {
    const user = await this.usersModel.findByPk(id);

    if (!user) throw new NotFoundException("Usuário não encontrado");

    await this.usersModel.destroy({ where: { id } });

    return { message: "Usuário excluído com sucesso" };
  }

  async list() {
    const list = await this.usersModel.findAll({ attributes: { exclude: ["password"] }, order: [["name", "ASC"]] });

    return { list };
  }

  async updatePatch(id: number, Udto: UpdateUserPatchDto) {
    const user = await this.usersModel.findByPk(id);

    if (!user) throw new NotFoundException("Usuário não encontrado");

    if (Udto.email) {
      const userExists = await this.usersModel.findOne({ where: { email: Udto.email } });

      if (userExists) throw new BadRequestException("E-mail já em uso");
    }
    if (Udto.iDepartment) {
      const departmentExists = await this.departmentsModel.findByPk(Udto.iDepartment);

      if (!departmentExists) throw new NotFoundException("Departamento não encontrado");
    }

    let hash: string = Udto.password;
    let birthDate: Date | undefined = undefined;
    let fireDate: Date | undefined = undefined;
    let hireDate: Date | undefined = undefined;

    if (Udto.password) {
      hash = await argon.hash(Udto.password);
    }
    if (Udto.birthDate) {
      birthDate = new Date(Udto.birthDate);
    }
    if (Udto.fireDate) {
      fireDate = new Date(Udto.fireDate);
    }
    if (Udto.hireDate) {
      hireDate = new Date(Udto.hireDate);
    }

    await this.usersModel.update(
      {
        active: Udto.active,
        address: Udto.address,
        addressCity: Udto.addressCity,
        addressDistrict: Udto.addressDistrict,
        addressNumber: Udto.addressNumber,
        addressState: Udto.addressState,
        addressZipCode: Udto.addressZipCode,
        birthDate: birthDate,
        cpf: Udto.cpf,
        email: Udto.email,
        fireDate: fireDate,
        hireDate: hireDate,
        iDepartment: Udto.iDepartment,
        name: Udto.name,
        office: Udto.office,
        password: hash,
        permAccounting: Udto.permAccounting,
        permAdmin: Udto.permAdmin,
        permCorporate: Udto.permCorporate,
        permFinances: Udto.permFinances,
        permHuman: Udto.permHuman,
        permMarketing: Udto.permMarketing,
        permOversee: Udto.permOversee,
        phone: Udto.phone,
      },
      { where: { id } },
    );

    return {
      message: "Usuário alterado com sucesso",
    };
  }

  async updatePut(id: number, Udto: UpdateUserPutDto) {
    const user = await this.usersModel.findByPk(id);

    if (!user) throw new NotFoundException("Usuário não encontrado");

    const userExists = await this.usersModel.findOne({ where: { email: Udto.email } });

    if (userExists && userExists.email !== user.email) throw new BadRequestException("E-mail já em uso");

    const departmentExists = await this.departmentsModel.findByPk(Udto.iDepartment);

    if (!departmentExists) throw new NotFoundException("Departamento não encontrado");

    const hash: string = await argon.hash(Udto.password);
    let fireDate: Date | undefined = undefined;

    if (Udto.fireDate) {
      fireDate = new Date(Udto.fireDate);
    }

    await this.usersModel.update(
      {
        active: Udto.active,
        address: Udto.address,
        addressCity: Udto.addressCity,
        addressDistrict: Udto.addressDistrict,
        addressNumber: Udto.addressNumber,
        addressState: Udto.addressState,
        addressZipCode: Udto.addressZipCode,
        birthDate: new Date(Udto.birthDate),
        cpf: Udto.cpf,
        email: Udto.email,
        fireDate: fireDate,
        hireDate: new Date(Udto.hireDate),
        iDepartment: Udto.iDepartment,
        name: Udto.name,
        office: Udto.office,
        password: hash,
        permAccounting: Udto.permAccounting,
        permAdmin: Udto.permAdmin,
        permCorporate: Udto.permCorporate,
        permFinances: Udto.permFinances,
        permHuman: Udto.permHuman,
        permMarketing: Udto.permMarketing,
        permOversee: Udto.permOversee,
        phone: Udto.phone,
      },
      { where: { id } },
    );

    return {
      message: "Usuário alterado com sucesso",
    };
  }
}
