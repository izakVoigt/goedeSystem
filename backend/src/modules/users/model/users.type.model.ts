import { brazilianStates } from "../../../util/enum/brazilianStates.enum";

export interface IUsersModel {
  id: number;
  active: boolean;
  address: string;
  addressCity: string;
  addressDistrict: string;
  addressNumber: number;
  addressState: brazilianStates;
  addressZipCode: string;
  birthDate: Date;
  cpf: string;
  createdAt: Date;
  deletedAt?: Date;
  email: string;
  fireDate?: Date;
  hireDate: Date;
  iDepartment: number;
  name: string;
  office: string;
  password: string;
  permAccounting: boolean;
  permAdmin: boolean;
  permCorporate: boolean;
  permFinances: boolean;
  permHuman: boolean;
  permMarketing: boolean;
  permOversee: boolean;
  phone: string;
  updatedAt: Date;
}
