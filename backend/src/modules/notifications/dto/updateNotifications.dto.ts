import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateNotificationPatchDto {
  @IsBoolean({ message: "Notificação de cliente deve ser um verdadeiro ou falso" })
  notificationClient?: boolean;

  @IsBoolean({ message: "Notificação de contato deve ser um verdadeiro ou falso" })
  notificationContact?: boolean;

  @IsBoolean({ message: "Notificação de currículo deve ser um verdadeiro ou falso" })
  notificationResume?: boolean;
}

export class UpdateNotificationPutDto {
  @IsBoolean({ message: "Notificação de cliente deve ser um verdadeiro ou falso" })
  @IsNotEmpty({ message: "Informe a notificação de cliente" })
  notificationClient: boolean;

  @IsBoolean({ message: "Notificação de contato deve ser um verdadeiro ou falso" })
  @IsNotEmpty({ message: "Informe a notificação de contato" })
  notificationContact: boolean;

  @IsBoolean({ message: "Notificação de currículo deve ser um verdadeiro ou falso" })
  @IsNotEmpty({ message: "Informe a notificação de currículo" })
  notificationResume: boolean;
}
