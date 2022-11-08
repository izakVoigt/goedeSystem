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
export class Notifications extends Model {
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
  notificationClient: boolean;

  @Column
  notificationContact: boolean;

  @Column
  notificationResume: boolean;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @BelongsTo(() => Users)
  user: Users;
}
