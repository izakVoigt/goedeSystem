import { IsNotEmpty, IsString } from "class-validator";

export class CreateDepartmentDto {
  @IsString({ message: "Descrição deve ser um texto" })
  @IsNotEmpty({ message: "Informe uma descrição" })
  description: string;

  @IsString({ message: "Nome deve ser um texto" })
  @IsNotEmpty({ message: "Informe um nome" })
  name: string;
}
