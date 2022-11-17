import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString({ message: "Endereço deve ser um texto" })
  @IsNotEmpty({ message: "Informe um endereço" })
  address: string;

  @IsString({ message: "Cidade deve ser um texto" })
  @IsNotEmpty({ message: "Informe uma cidade" })
  addressCity: string;

  @IsString({ message: "Bairro deve ser um texto" })
  @IsNotEmpty({ message: "Informe um bairro" })
  addressDistrict: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { message: "Número de endereço deve ser um número" },
  )
  @IsNotEmpty({ message: "Informe um número de endereço" })
  addressNumber: number;

  @IsString({ message: "Estado deve ser um texto" })
  @IsNotEmpty({ message: "Informe um estado" })
  addressState: string;

  @IsString({ message: "CEP deve ser um texto" })
  @IsNotEmpty({ message: "Informe um CEP" })
  addressZipCode: string;

  @IsString({ message: "Data de nascimento deve ser um texto" })
  @IsNotEmpty({ message: "Informe uma data de nascimento" })
  birthDate: string;

  @IsString({ message: "CPF deve ser um texto" })
  @IsNotEmpty({ message: "Informe um CPF" })
  cpf: string;

  @IsEmail({ ignore_max_length: true }, { message: "Informe um formato de e-mail válido" })
  @IsNotEmpty({ message: "Informe um e-mail" })
  email: string;

  @IsString({ message: "Data de admissão deve ser um texto" })
  @IsNotEmpty({ message: "Informe uma data de admissão" })
  hireDate: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { message: "Id do departamento deve ser um número" },
  )
  @IsNotEmpty({ message: "Informe um departamento" })
  iDepartment: number;

  @IsString({ message: "Nome deve ser um texto" })
  @IsNotEmpty({ message: "Informe um nome" })
  name: string;

  @IsString({ message: "Cargo deve ser um texto" })
  @IsNotEmpty({ message: "Informe um cargo" })
  office: string;

  @IsString({ message: "Senha deve ser um texto" })
  @MinLength(8, { message: "A senha deve ter no mínimo 8 caracteres" })
  @MaxLength(64, { message: "A senha deve ter no máximo 64 caracteres" })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: "Senha muito fraca" })
  @IsNotEmpty({ message: "Informe uma senha" })
  password: string;

  @IsBoolean({ message: "Permissão contábil deve ser verdadeiro ou falso" })
  @IsNotEmpty({ message: "Informe a permissão contábil" })
  permAccounting: boolean;

  @IsBoolean({ message: "Permissão administrador deve ser verdadeiro ou falso" })
  @IsNotEmpty({ message: "Informe a permissão administrador" })
  permAdmin: boolean;

  @IsBoolean({ message: "Permissão societário deve ser verdadeiro ou falso" })
  @IsNotEmpty({ message: "Informe a permissão societário" })
  permCorporate: boolean;

  @IsBoolean({ message: "Permissão finanças deve ser verdadeiro ou falso" })
  @IsNotEmpty({ message: "Informe a permissão finanças" })
  permFinances: boolean;

  @IsBoolean({ message: "Permissão RH deve ser verdadeiro ou falso" })
  @IsNotEmpty({ message: "Informe a permissão RH" })
  permHuman: boolean;

  @IsBoolean({ message: "Permissão marketing deve ser verdadeiro ou falso" })
  @IsNotEmpty({ message: "Informe a permissão marketing" })
  permMarketing: boolean;

  @IsBoolean({ message: "Permissão fiscal deve ser verdadeiro ou falso" })
  @IsNotEmpty({ message: "Informe a permissão fiscal" })
  permOversee: boolean;

  @IsString({ message: "Celular deve ser um texto" })
  @IsNotEmpty({ message: "Informe um celular" })
  phone: string;
}
