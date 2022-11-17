import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateVacancyDto {
  @IsString({ message: "Descrição deve ser um texto" })
  @IsNotEmpty({ message: "Informe uma descrição" })
  description: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { message: "Id do departamento deve ser um número" },
  )
  @IsNotEmpty({ message: "Informe um departamento" })
  iDepartment: number;

  @IsString({ message: "Requisitos deve ser um texto" })
  @IsNotEmpty({ message: "Informe os requisitos" })
  requirements: string;

  @IsString({ message: "Título deve ser um texto" })
  @IsNotEmpty({ message: "Informe um título" })
  title: string;
}
