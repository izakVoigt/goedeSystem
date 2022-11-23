import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import smtpConfig from "../config/smtp.config";

export class MailSender {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport(smtpConfig);
  }

  async send(to: string, subject: string, html: string, replyTo?: string) {
    const sendResult = {
      sended: false,
      error: null,
    };

    await this.transporter
      .sendMail({
        from: "Site Goede<site@goedeassessoria.com.br>",
        to,
        replyTo,
        subject,
        html,
      })
      .then(() => {
        sendResult.sended = true;
        sendResult.error = null;
      })
      .catch((err) => {
        sendResult.sended = false;
        sendResult.error = new Error(err);
      });

    return sendResult;
  }
}
