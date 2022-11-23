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
import { Users } from "../../users/model/users.model";

@Table
export class Permissions extends Model {
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

  @ForeignKey(() => Users)
  @Column("int")
  iUser!: number;

  @Column
  permAccounting: boolean;

  @Column
  permAdmin: boolean;

  @Column
  permCorporate: boolean;

  @Column
  permFinances: boolean;

  @Column
  permHuman: boolean;

  @Column
  permMarketing: boolean;

  @Column
  permOversee: boolean;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @BelongsTo(() => Users)
  user: Users;
}
