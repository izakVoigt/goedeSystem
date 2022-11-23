import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class CreatePermissionDto {
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { message: "Id do usuário deve ser um número" },
  )
  @IsNotEmpty({ message: "Informe o id do usuário" })
  iUser: number;

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
}
