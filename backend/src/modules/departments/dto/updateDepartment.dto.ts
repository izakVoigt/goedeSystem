import { IsNotEmpty, IsString } from "class-validator";

export class UpdateDepartmentPatchDto {
  @IsString({ message: "Descrição deve ser um texto" })
  description?: string;

  @IsString({ message: "Nome deve ser um texto" })
  name?: string;
}

export class UpdateDepartmentPutDto {
  @IsString({ message: "Descrição deve ser um texto" })
  @IsNotEmpty({ message: "Informe uma descrição" })
  description: string;

  @IsString({ message: "Nome deve ser um texto" })
  @IsNotEmpty({ message: "Informe um nome" })
  name: string;
}
