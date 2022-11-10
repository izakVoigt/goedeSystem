import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { ThrottlerModule } from "@nestjs/throttler";

import { databaseOptions } from "./config/database.config";

import { AuthModule } from "./auth/auth.module";
import { ContactsModule } from "./modules/contacts/contacts.module";
import { DepartmentsModule } from "./modules/departments/departments.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { RootModule } from "./modules/root/root.module";
import { UsersModule } from "./modules/users/users.module";
import { VacanciesModule } from "./modules/vacancies/vacancies.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot(databaseOptions),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    AuthModule,
    ContactsModule,
    DepartmentsModule,
    NotificationsModule,
    RootModule,
    UsersModule,
    VacanciesModule,
  ],
})
export class AppModule {}
