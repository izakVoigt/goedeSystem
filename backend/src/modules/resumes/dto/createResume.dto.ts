import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateResumeDto {
  @IsEmail()
  @IsNotEmpty({ message: "Informe um e-mail" })
  email: string;

  @IsString({ message: "Departamento deve ser um texto" })
  @IsNotEmpty({ message: "Informe um departamento" })
  iDepartment: string;

  @IsString({ message: "Nome deve ser um texto" })
  @IsNotEmpty({ message: "Informe um nome" })
  name: string;

  @IsString({ message: "Telefone deve ser um texto" })
  @IsNotEmpty({ message: "Informe um telefone" })
  phone: string;
}
