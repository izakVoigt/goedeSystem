export interface IResumesModel {
  id: number;
  createdAt: Date;
  deletedAt?: Date;
  email: string;
  filePath: string;
  iDepartment: number;
  name: string;
  observations?: string;
  phone: string;
  revised: boolean;
  updatedAt: Date;
}
