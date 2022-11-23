import { Injectable, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { MessageContactDto } from "./dto";
import { Users } from "../users/model/users.model";
import { Notifications } from "../notifications/model/notifications.model";
import { MailSender } from "../../services/mailSender.service";
import contactMessage from "../../util/html/contactMessage";

@Injectable()
export class ContactsService {
  private sender: MailSender;

  constructor(
    @InjectModel(Users)
    private usersModel: typeof Users,
  ) {
    this.sender = new MailSender();
  }

  async sendMessageContact(dto: MessageContactDto) {
    const { name, email, phone, subject, message, terms } = dto;

    if (!terms) throw new BadRequestException("Aceite os termos de privacidade para enviar a mensagem");

    const html = contactMessage(name, email, phone, subject, message);

    const emailList = await this.usersModel
      .findAll({
        attributes: ["email"],
        include: { model: Notifications, required: true, where: { notificationContact: true }, attributes: [] },
      })
      .then((list) => {
        const emails: string[] = [];

        list.forEach((item) => {
          emails.push(item.email);
        });

        return emails;
      });

    if (emailList.length === 0) {
      console.log("Nenhum usuário cadastrado para receber notificações de contato");

      throw new InternalServerErrorException("Erro ao enviar mensagem, tente novamente mais tarde");
    }

    for (let i = 0; i < emailList.length; i++) {
      const sended = await this.sender.send(emailList[i], "Nova mensagem recebida pelo site", html);

      if (sended.error !== null) {
        console.log(sended.error);
        throw new InternalServerErrorException("Erro ao enviar mensagem, tente novamente mais tarde");
      }
    }

    return { message: "Mensagem enviada com sucesso" };
  }
}
