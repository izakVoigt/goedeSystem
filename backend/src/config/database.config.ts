import * as dotenv from "dotenv";
import { SequelizeModuleOptions } from "@nestjs/sequelize";

dotenv.config({ path: ".env" });

import { Departments } from "../modules/departments/model/departments.model";
import { Notifications } from "../modules/notifications/model/notifications.model";
import { Users } from "../modules/users/model/users.model";
import { Vacancies } from "../modules/vacancies/model/vacancies.model";

export const databaseOptions: SequelizeModuleOptions = {
  dialect: "mysql",
  host: process.env.DATABASE_ROOT_HOST,
  port: parseInt(process.env.DATABASE_ROOT_PORT),
  username: process.env.DATABASE_ROOT_USER,
  database: process.env.DATABASE_ROOT_DB,
  models: [Departments, Notifications, Users, Vacancies],
  logging: false,
};
