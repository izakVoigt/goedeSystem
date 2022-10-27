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
export class Vacancies extends Model {
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
  description: string;

  @ForeignKey(() => Departments)
  @Column("int")
  iDepartment!: number;

  @Column
  requirements: string;

  @Column
  title: string;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @BelongsTo(() => Departments)
  department: Departments;
}
