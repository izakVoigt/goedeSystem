import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectModel } from "@nestjs/sequelize";
import { Users } from "../modules/users/model/users.model";
import { Notifications } from "../modules/notifications/model/notifications.model";
import { Resumes } from "../modules/resumes/model/resumes.model";
import { MailSender } from "../services/mailSender.service";
import resumesNotRevisedNotification from "../util/html/resumeNotRevisedNotification";

@Injectable()
export class ResumesScheduleTasks {
  private sender: MailSender;

  constructor(
    @InjectModel(Resumes)
    private readonly resumesModel: typeof Resumes,
    @InjectModel(Users)
    private usersModel: typeof Users,
  ) {
    this.sender = new MailSender();
  }

  // Every monday to friday at 06:00am
  @Cron("0 40 13 * * 1-5", { name: "resumesNotRevisedNotification", timeZone: "America/Sao_Paulo" })
  async resumesNotRevised() {
    const list = await this.resumesModel.findAll({ where: { revised: false } });

    if (list.length >= 1) {
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

      const html = resumesNotRevisedNotification(list.length);

      for (let i = 0; i < emailList.length; i++) {
        const sended = await this.sender.send(emailList[i], "Currículos cadastrados não vizualizados", html);

        if (sended.error !== null) {
          console.log(sended.error);
          break;
        }
      }
    }
  }
}
