import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateResumePatchDto {
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { message: "Id do departamento deve ser um número" },
  )
  iDepartment?: number;

  @IsString({ message: "Observações deve ser um texto" })
  observations?: string;

  @IsBoolean({ message: "Revisado deve ser um verdadeiro ou falso" })
  revised?: boolean;
}

export class UpdateResumePutDto {
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { message: "Id do departamento deve ser um número" },
  )
  @IsNotEmpty({ message: "Informe um departamento" })
  iDepartment: number;

  @IsString({ message: "Observações deve ser um texto" })
  @IsNotEmpty({ message: "Informe uma observação" })
  observations: string;

  @IsBoolean({ message: "Revisado deve ser um verdadeiro ou falso" })
  @IsNotEmpty({ message: "Informe se está revisado" })
  revised: boolean;
}
