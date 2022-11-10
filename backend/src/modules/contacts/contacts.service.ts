import * as nodemailer from "nodemailer";
import { Injectable, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { MessageContactDto } from "./dto";
import { Users } from "../users/model/users.model";
import { Notifications } from "../notifications/model/notifications.model";
import smtpConfig from "../../config/smtp.config";
import htmlContactMessage from "../../util/html/message";

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Users)
    private usersModel: typeof Users,
  ) {}

  async sendMessageContact(dto: MessageContactDto) {
    const { name, email, phone, subject, message, terms } = dto;

    if (!terms) throw new BadRequestException("Aceite os termos de privacidade para enviar a mensagem");

    const html = htmlContactMessage(name, email, phone, subject, message);

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

    await this.nodemailer(emailList, email, "Nova mensagem recebida pelo site", html);

    return { message: "Mensagem enviada com sucesso" };
  }

  private async nodemailer(to: string | string[], replyTo: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport(smtpConfig);

    let emailSended = false;

    await transporter
      .sendMail({
        from: "Site Goede<site@goedeassessoria.com.br>",
        to,
        replyTo,
        subject,
        html,
      })
      .then(() => {
        emailSended = true;
      });

    return emailSended;
  }
}
