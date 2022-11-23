export interface IPermissionsModel {
  id: number;
  createdAt: Date;
  deletedAt?: Date;
  iUser: number;
  permAccounting: boolean;
  permAdmin: boolean;
  permCorporate: boolean;
  permFinances: boolean;
  permHuman: boolean;
  permMarketing: boolean;
  permOversee: boolean;
  updatedAt: Date;
}
