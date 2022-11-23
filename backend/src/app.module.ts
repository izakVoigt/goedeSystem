import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import { MulterModule } from "@nestjs/platform-express";
import { databaseOptions } from "./config/database.config";
import { AuthModule } from "./auth/auth.module";
import { ContactsModule } from "./modules/contacts/contacts.module";
import { DepartmentsModule } from "./modules/departments/departments.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { PermissionsModule } from "./modules/permissions/permissions.module";
import { ResumesModule } from "./modules/resumes/resumes.module";
import { RootModule } from "./modules/root/root.module";
import { UsersModule } from "./modules/users/users.module";
import { VacanciesModule } from "./modules/vacancies/vacancies.module";

import { ResumesScheduleTasks } from "./schedule/resume.schedule";
import { ShutdownService } from "./services/shutdown.service";
import { StartService } from "./services/start.service";

import { Departments } from "./modules/departments/model/departments.model";
import { Notifications } from "./modules/notifications/model/notifications.model";
import { Permissions } from "./modules/permissions/model/permissions.model";
import { Resumes } from "./modules/resumes/model/resumes.model";
import { Users } from "./modules/users/model/users.model";
import { Vacancies } from "./modules/vacancies/model/vacancies.model";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({ dest: "./upload/" }),
    SequelizeModule.forRoot(databaseOptions),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    SequelizeModule.forFeature([Departments, Notifications, Permissions, Resumes, Users, Vacancies]),
    AuthModule,
    ContactsModule,
    DepartmentsModule,
    NotificationsModule,
    PermissionsModule,
    ResumesModule,
    RootModule,
    UsersModule,
    VacanciesModule,
  ],
  providers: [ResumesScheduleTasks, ShutdownService, StartService],
})
export class AppModule {}
