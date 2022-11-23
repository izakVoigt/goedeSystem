import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreatePermissionDto, UpdatePermissionPatchDto, UpdatePermissionPutDto } from "./dto";
import { Permissions } from "./model/permissions.model";
import { Users } from "../users/model/users.model";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permissions)
    private permissionsModel: typeof Permissions,
    @InjectModel(Users)
    private usersModel: typeof Users,
  ) {}

  async create(Cdto: CreatePermissionDto) {
    const { iUser, permAccounting, permAdmin, permCorporate, permFinances, permHuman, permMarketing, permOversee } =
      Cdto;

    const userExists = await this.usersModel.findByPk(iUser);

    if (!userExists) throw new NotFoundException("Usuário não encontrado");

    const userHavePermission = await this.permissionsModel.findOne({ where: { iUser } });

    if (userHavePermission) throw new BadRequestException("Usuário já tem permissões cadastradas");

    await this.permissionsModel.create({
      iUser,
      permAccounting,
      permAdmin,
      permCorporate,
      permFinances,
      permHuman,
      permMarketing,
      permOversee,
    });

    return { message: "Permissões criadas com sucesso" };
  }

  async data(id: number) {
    const data = await this.permissionsModel.findByPk(id);

    if (!data) throw new NotFoundException("Permissão não encontrada");

    return data;
  }

  async destroy(id: number) {
    const permission = await this.permissionsModel.findByPk(id);

    if (!permission) throw new NotFoundException("Permissão não encontrada");

    await this.permissionsModel.destroy({ where: { id } });

    return { message: "Permissão excluída com sucesso" };
  }

  async updatePatch(id: number, Udto: UpdatePermissionPatchDto) {
    const { permAccounting, permAdmin, permCorporate, permFinances, permHuman, permMarketing, permOversee } = Udto;

    const permission = await this.permissionsModel.findByPk(id);

    if (!permission) throw new NotFoundException("Permissão não encontrada");

    await this.permissionsModel.update(
      {
        permAccounting,
        permAdmin,
        permCorporate,
        permFinances,
        permHuman,
        permMarketing,
        permOversee,
      },
      { where: { id } },
    );

    return {
      message: "Permissão alterada com sucesso",
    };
  }

  async updatePut(id: number, Udto: UpdatePermissionPutDto) {
    const { permAccounting, permAdmin, permCorporate, permFinances, permHuman, permMarketing, permOversee } = Udto;

    const permission = await this.permissionsModel.findByPk(id);

    if (!permission) throw new NotFoundException("Permissão não encontrada");

    await this.permissionsModel.update(
      {
        permAccounting,
        permAdmin,
        permCorporate,
        permFinances,
        permHuman,
        permMarketing,
        permOversee,
      },
      { where: { id } },
    );

    return {
      message: "Permissão alterada com sucesso",
    };
  }
}
