import {
  AllowNull,
  AutoIncrement,
  CreatedAt,
  Table,
  Column,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Unique,
  UpdatedAt,
} from "sequelize-typescript";
import { Users } from "../../users/model/users.model";
import { Vacancies } from "../../vacancies/model/vacancies.model";

@Table
export class Departments extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column("int")
  id: number;

  @CreatedAt
  @Column
  createdAt: Date;

  @DeletedAt
  @AllowNull
  @Column
  deletedAt?: Date;

  @Column
  description: string;

  @Unique
  @Column
  name: string;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @HasMany(() => Users)
  users: Users[];

  @HasMany(() => Vacancies)
  vacancies: Vacancies[];
}
