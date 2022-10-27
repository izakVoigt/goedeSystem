import * as dotenv from "dotenv";
import { SequelizeModuleOptions } from "@nestjs/sequelize";

dotenv.config({ path: ".env" });

import { Departments } from "../modules/departments/model/departments.model";
import { Users } from "../modules/users/model/users.model";
import { Vacancies } from "../modules/vacancies/model/vacancies.model";

// export const databaseOptions: SequelizeModuleOptions = {
//   dialect: "mysql",
//   host: process.env.DATABASE_ROOT_HOST,
//   port: parseInt(process.env.DATABASE_ROOT_PORT),
//   username: process.env.DATABASE_ROOT_USER,
//   password: process.env.DATABASE_ROOT_PASSWORD,
//   database: process.env.DATABASE_ROOT_DB,
//   models: [__dirname + "../modules/**/model/*.model{.ts,.js}"],
// };

export const databaseOptions: SequelizeModuleOptions = {
  dialect: "mysql",
  host: "localhost",
  port: 3307,
  username: "root",
  // password: "#Goede.2022",
  database: "goede",
  models: [Departments, Users, Vacancies],
  logging: false,
};
