import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class CreateNotificationDto {
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { message: "Id do usuário deve ser um número" },
  )
  @IsNotEmpty({ message: "Informe o id do usuário" })
  iUser: number;

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
