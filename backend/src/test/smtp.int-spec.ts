import * as nodemailer from "nodemailer";
import smtpConfig from "../config/smtp.config";

describe("STMP test", () => {
  it("should send email", async () => {
    let emailSended = false;

    const transporter = nodemailer.createTransport(smtpConfig);

    await transporter
      .sendMail({
        from: "Site Goede<site@goedeassessoria.com.br>",
        to: "tecnico01@goedeassessoria.com.br",
        replyTo: "tecnico01@goedeassessoria.com.br",
        subject: "Test SMTP",
        html: "<p>Test STMP</p>",
      })
      .then(() => (emailSended = true))
      .catch((err) => console.log(err));

    expect(emailSended).toEqual(true);
  });
});
