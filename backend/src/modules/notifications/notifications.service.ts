import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateNotificationDto, UpdateNotificationPatchDto, UpdateNotificationPutDto } from "./dto";
import { Notifications } from "./model/notifications.model";
import { Users } from "../users/model/users.model";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notifications)
    private notificationsModel: typeof Notifications,
    @InjectModel(Users)
    private usersModel: typeof Users,
  ) {}

  async create(Cdto: CreateNotificationDto) {
    const { iUser, notificationClient, notificationContact, notificationResume } = Cdto;

    const userExists = await this.usersModel.findByPk(iUser);

    if (!userExists) throw new NotFoundException("Usuário não encontrado");

    const userHaveNotification = await this.notificationsModel.findOne({ where: { iUser } });

    if (userHaveNotification) throw new BadRequestException("Usuário já tem notificações cadastradas");

    await this.notificationsModel.create({
      iUser,
      notificationClient,
      notificationContact,
      notificationResume,
    });

    return { message: "Notificação criada com sucesso" };
  }

  async data(id: number) {
    const data = await this.notificationsModel.findByPk(id);

    if (!data) throw new NotFoundException("Notificação não encontrada");

    return { data };
  }

  async destroy(id: number) {
    const notification = await this.notificationsModel.findByPk(id);

    if (!notification) throw new NotFoundException("Notificação não encontrada");

    await this.notificationsModel.destroy({ where: { id } });

    return { message: "Notificação excluída com sucesso" };
  }

  async list() {
    const list = await this.notificationsModel.findAll({ order: [["iUser", "ASC"]] });

    return { list };
  }

  async updatePatch(id: number, Udto: UpdateNotificationPatchDto) {
    const { notificationClient, notificationContact, notificationResume } = Udto;

    const notification = await this.notificationsModel.findByPk(id);

    if (!notification) throw new NotFoundException("Notificação não encontrada");

    await this.notificationsModel.update(
      {
        notificationClient,
        notificationContact,
        notificationResume,
      },
      { where: { id } },
    );

    return {
      message: "Notificação alterada com sucesso",
    };
  }

  async updatePut(id: number, Udto: UpdateNotificationPutDto) {
    const { notificationClient, notificationContact, notificationResume } = Udto;

    const notification = await this.notificationsModel.findByPk(id);

    if (!notification) throw new NotFoundException("Notificação não encontrada");

    await this.notificationsModel.update(
      {
        notificationClient,
        notificationContact,
        notificationResume,
      },
      { where: { id } },
    );

    return {
      message: "Notificação alterada com sucesso",
    };
  }
}
