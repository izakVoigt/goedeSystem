import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class MessageContactDto {
  @IsString({ message: "Nome deve ser um texto" })
  @IsNotEmpty({ message: "Informe um nome" })
  name: string;

  @IsEmail({ ignore_max_length: true }, { message: "Informe um formato de e-mail válido" })
  @IsNotEmpty({ message: "Informe um e-mail" })
  email: string;

  @IsString({ message: "Telefone deve ser um texto" })
  @IsNotEmpty({ message: "Informe um telefone" })
  phone: string;

  @IsString({ message: "Assunto deve ser um texto" })
  @IsNotEmpty({ message: "Informe um assunto" })
  subject: string;

  @IsString({ message: "Mensagem deve ser um texto" })
  @IsNotEmpty({ message: "Informe uma mensagem" })
  message: string;

  @IsBoolean({ message: "Termos deve ser um verdadeiro ou falso" })
  @IsNotEmpty({ message: "Informe os termos" })
  terms: boolean;
}
