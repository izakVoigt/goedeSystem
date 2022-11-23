import * as dotenv from "dotenv";
import { SequelizeModuleOptions } from "@nestjs/sequelize";
import { Departments } from "../modules/departments/model/departments.model";
import { Notifications } from "../modules/notifications/model/notifications.model";
import { Permissions } from "../modules/permissions/model/permissions.model";
import { Resumes } from "../modules/resumes/model/resumes.model";
import { Users } from "../modules/users/model/users.model";
import { Vacancies } from "../modules/vacancies/model/vacancies.model";

dotenv.config({ path: ".env" });

export const databaseOptions: SequelizeModuleOptions = {
  dialect: "mysql",
  host: process.env.DATABASE_ROOT_HOST,
  port: parseInt(process.env.DATABASE_ROOT_PORT),
  username: process.env.DATABASE_ROOT_USER,
  database: process.env.DATABASE_ROOT_DB,
  models: [Departments, Notifications, Permissions, Resumes, Users, Vacancies],
  logging: false,
};
