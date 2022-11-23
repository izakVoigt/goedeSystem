import * as argon from "argon2";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
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
    const {
      address,
      addressCity,
      addressDistrict,
      addressNumber,
      addressState,
      addressZipCode,
      birthDate,
      cpf,
      email,
      hireDate,
      iDepartment,
      name,
      office,
      password,
      permAccounting,
      permAdmin,
      permCorporate,
      permFinances,
      permHuman,
      permMarketing,
      permOversee,
      phone,
    } = Cdto;

    const userExists = await this.usersModel.findOne({ where: { email } });

    if (userExists) throw new BadRequestException("E-mail já em uso");

    const departmentExists = await this.departmentsModel.findByPk(iDepartment);

    if (!departmentExists) throw new NotFoundException("Departamento não encontrado");

    const hash = await argon.hash(password);

    await this.usersModel.create({
      active: true,
      address,
      addressCity,
      addressDistrict,
      addressNumber,
      addressState,
      addressZipCode,
      birthDate: new Date(birthDate),
      cpf,
      email,
      hireDate: new Date(hireDate),
      iDepartment,
      name,
      office,
      password: hash,
      permAccounting,
      permAdmin,
      permCorporate,
      permFinances,
      permHuman,
      permMarketing,
      permOversee,
      phone,
    });

    return { message: "Usuário criado com sucesso" };
  }

  async data(id: number) {
    const data = await this.usersModel.findByPk(id, { attributes: { exclude: ["password"] } });

    if (!data) throw new NotFoundException("Usuário não encontrado");

    return data;
  }

  async destroy(id: number) {
    const user = await this.usersModel.findByPk(id);

    if (!user) throw new NotFoundException("Usuário não encontrado");

    await this.usersModel.destroy({ where: { id } });

    return { message: "Usuário excluído com sucesso" };
  }

  async list(page: number, limit: number, query?: string, iDepartment?: number) {
    if (!page) {
      return new BadRequestException("Informe o número da página");
    }
    if (!limit) {
      return new BadRequestException("Informe o limite de resultados na página");
    }

    const offset = (page - 1) * limit;

    if (query && iDepartment) {
      const list = await this.usersModel.findAll({
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${query}%` } }, { email: { [Op.like]: `%${query}%` } }],
          iDepartment,
        },
        attributes: { include: ["id", "email", "name"] },
        order: [["name", "ASC"]],
        limit: limit,
        offset: offset,
      });

      return list;
    }
    if (query) {
      const list = await this.usersModel.findAll({
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${query}%` } }, { email: { [Op.like]: `%${query}%` } }],
        },
        attributes: { include: ["id", "email", "name"] },
        order: [["name", "ASC"]],
        limit: limit,
        offset: offset,
      });

      return list;
    }
    if (iDepartment) {
      const list = await this.usersModel.findAll({
        where: { iDepartment },
        attributes: { include: ["id", "email", "name"] },
        order: [["name", "ASC"]],
        limit: limit,
        offset: offset,
      });

      return list;
    }
    const list = await this.usersModel.findAll({
      attributes: { include: ["id", "email", "name"] },
      order: [["name", "ASC"]],
      limit: limit,
      offset: offset,
    });

    return list;
  }

  async updatePatch(id: number, Udto: UpdateUserPatchDto) {
    const {
      active,
      address,
      addressCity,
      addressDistrict,
      addressNumber,
      addressState,
      addressZipCode,
      birthDate,
      cpf,
      email,
      fireDate,
      hireDate,
      iDepartment,
      name,
      office,
      password,
      permAccounting,
      permAdmin,
      permCorporate,
      permFinances,
      permHuman,
      permMarketing,
      permOversee,
      phone,
    } = Udto;

    const user = await this.usersModel.findByPk(id);

    if (!user) throw new NotFoundException("Usuário não encontrado");

    if (email) {
      const userExists = await this.usersModel.findOne({ where: { email } });

      if (userExists) throw new BadRequestException("E-mail já em uso");
    }
    if (iDepartment) {
      const departmentExists = await this.departmentsModel.findByPk(iDepartment);

      if (!departmentExists) throw new NotFoundException("Departamento não encontrado");
    }

    let hash: string = Udto.password;
    let BirthDate: Date | undefined = undefined;
    let FireDate: Date | undefined = undefined;
    let HireDate: Date | undefined = undefined;

    if (password) {
      hash = await argon.hash(Udto.password);
    }
    if (birthDate) {
      BirthDate = new Date(birthDate);
    }
    if (fireDate) {
      FireDate = new Date(fireDate);
    }
    if (hireDate) {
      HireDate = new Date(hireDate);
    }

    await this.usersModel.update(
      {
        active,
        address,
        addressCity,
        addressDistrict,
        addressNumber,
        addressState,
        addressZipCode,
        birthDate: BirthDate,
        cpf,
        email,
        fireDate: FireDate,
        hireDate: HireDate,
        iDepartment,
        name,
        office,
        password: hash,
        permAccounting,
        permAdmin,
        permCorporate,
        permFinances,
        permHuman,
        permMarketing,
        permOversee,
        phone,
      },
      { where: { id } },
    );

    return {
      message: "Usuário alterado com sucesso",
    };
  }

  async updatePut(id: number, Udto: UpdateUserPutDto) {
    const {
      active,
      address,
      addressCity,
      addressDistrict,
      addressNumber,
      addressState,
      addressZipCode,
      birthDate,
      cpf,
      email,
      fireDate,
      hireDate,
      iDepartment,
      name,
      office,
      password,
      permAccounting,
      permAdmin,
      permCorporate,
      permFinances,
      permHuman,
      permMarketing,
      permOversee,
      phone,
    } = Udto;

    const user = await this.usersModel.findByPk(id);

    if (!user) throw new NotFoundException("Usuário não encontrado");

    const userExists = await this.usersModel.findOne({ where: { email } });

    if (userExists && userExists.email !== user.email) throw new BadRequestException("E-mail já em uso");

    const departmentExists = await this.departmentsModel.findByPk(iDepartment);

    if (!departmentExists) throw new NotFoundException("Departamento não encontrado");

    const hash: string = await argon.hash(password);
    let FireDate: Date | undefined = undefined;

    if (Udto.fireDate) {
      FireDate = new Date(fireDate);
    }

    await this.usersModel.update(
      {
        active,
        address,
        addressCity,
        addressDistrict,
        addressNumber,
        addressState,
        addressZipCode,
        birthDate: new Date(birthDate),
        cpf,
        email,
        fireDate: FireDate,
        hireDate: new Date(hireDate),
        iDepartment,
        name,
        office,
        password: hash,
        permAccounting,
        permAdmin,
        permCorporate,
        permFinances,
        permHuman,
        permMarketing,
        permOversee,
        phone,
      },
      { where: { id } },
    );

    return {
      message: "Usuário alterado com sucesso",
    };
  }
}
