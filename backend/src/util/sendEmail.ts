import * as nodemailer from "nodemailer";
import smtpConfig from "../config/smtp.config";

const transporter = nodemailer.createTransport(smtpConfig);

export const sendEmail = async (to: string, replyTo: string, subject: string, html: string) => {
  let emailSended = false;

  await transporter
    .sendMail({
      from: "Site Goede<site@goedeassessoria.com.br>",
      to,
      replyTo,
      subject,
      html,
    })
    .then(() => (emailSended = true));

  return emailSended;
};
