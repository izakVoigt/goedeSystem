export interface IVacanciesModel {
  id: number;
  createdAt: Date;
  deletedAt?: Date;
  description: string;
  iDepartment: number;
  requirements: string;
  title: string;
  updatedAt: Date;
}
