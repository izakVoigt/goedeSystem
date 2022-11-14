import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  CreatedAt,
  ForeignKey,
  Table,
  Column,
  DeletedAt,
  Model,
  PrimaryKey,
  UpdatedAt,
} from "sequelize-typescript";
import { Departments } from "../../departments/model/departments.model";

@Table
export class Resumes extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column("int")
  id!: number;

  @CreatedAt
  @Column
  createdAt: Date;

  @DeletedAt
  @AllowNull
  @Column
  deletedAt?: Date;

  @Column
  email: string;

  @Column
  filePath: string;

  @ForeignKey(() => Departments)
  @Column("int")
  iDepartment!: number;

  @Column
  name: string;

  @AllowNull
  @Column
  observations: string;

  @Column
  phone: string;

  @Column
  revised: boolean;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @BelongsTo(() => Departments)
  department: Departments;
}
