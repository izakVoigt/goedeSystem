import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  CreatedAt,
  Default,
  ForeignKey,
  Table,
  Column,
  DeletedAt,
  Model,
  PrimaryKey,
  Unique,
  UpdatedAt,
  IsEmail,
  HasOne,
} from "sequelize-typescript";
import { brazilianStates } from "../../../util/enum/brazilianStates.enum";
import { Departments } from "../../departments/model/departments.model";
import { Notifications } from "../../notifications/model/notifications.model";
import { Permissions } from "../../permissions/model/permissions.model";

@Table
export class Users extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column("int")
  id: number;

  @Default(true)
  @Column
  active: boolean;

  @Column
  address: string;

  @Column
  addressCity: string;

  @Column
  addressDistrict: string;

  @Column("int")
  addressNumber: number;

  @Column
  addressState: brazilianStates;

  @Column
  addressZipCode: string;

  @Column
  birthDate: Date;

  @Column
  cpf: string;

  @CreatedAt
  @Column
  createdAt: Date;

  @DeletedAt
  @AllowNull
  @Column
  deletedAt?: Date;

  @Unique
  @IsEmail
  @Column
  email: string;

  @AllowNull
  @Column
  fireDate?: Date;

  @Column
  hireDate: Date;

  @ForeignKey(() => Departments)
  @Column("int")
  iDepartment: number;

  @Column
  name: string;

  @Column
  office: string;

  @Column
  password: string;

  @Column
  phone: string;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @BelongsTo(() => Departments)
  department: Departments;

  @HasOne(() => Notifications)
  notification: Notifications;

  @HasOne(() => Permissions)
  permission: Permissions;
}
