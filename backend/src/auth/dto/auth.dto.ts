import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AuthDto {
  @IsEmail({ ignore_max_length: true }, { message: "Informe um formato de e-mail válido" })
  @IsNotEmpty({ message: "Informe um e-mail" })
  email: string;

  @IsString({ message: "Senha deve ser no formato texto" })
  @MinLength(8, { message: "A senha deve ter no mínimo 8 caracteres" })
  @MaxLength(64, { message: "A senha deve ter no máximo 64 caracteres" })
  @IsNotEmpty({ message: "Informe uma senha" })
  password: string;
}
