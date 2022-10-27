import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateVacancyDto {
  @IsString({ message: "Descrição deve ser um texto" })
  @IsNotEmpty({ message: "Informe uma descrição" })
  description: string;

  @IsNumber()
  @IsNotEmpty({ message: "Informe um departamento" })
  iDepartment: number;

  @IsString({ message: "Requisitos deve ser um texto" })
  @IsNotEmpty({ message: "Informe os requisitos" })
  requirements: string;

  @IsString({ message: "Título deve ser um texto" })
  @IsNotEmpty({ message: "Informe um título" })
  title: string;
}
