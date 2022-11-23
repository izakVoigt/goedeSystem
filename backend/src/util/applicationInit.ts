import * as argon from "argon2";
import * as fs from "fs-extra";
import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Departments } from "../modules/departments/model/departments.model";
import { Notifications } from "../modules/notifications/model/notifications.model";
import { Resumes } from "../modules/resumes/model/resumes.model";
import { Users } from "../modules/users/model/users.model";
import { Vacancies } from "../modules/vacancies/model/vacancies.model";

@Injectable()
export class ApplicationInit implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Departments)
    private departmentModel: typeof Departments,
    @InjectModel(Notifications)
    private notificationsModel: typeof Notifications,
    @InjectModel(Resumes)
    private resumesModel: typeof Resumes,
    @InjectModel(Users)
    private usersModel: typeof Users,
    @InjectModel(Vacancies)
    private vacanciesModel: typeof Vacancies,
  ) {}

  async onApplicationBootstrap() {
    interface fileData {
      departments: { name: string; description: string }[];
      users: {
        active: boolean;
        address: string;
        addressCity: string;
        addressDistrict: string;
        addressNumber: number;
        addressState: string;
        addressZipCode: string;
        birthDate: Date;
        cpf: string;
        email: string;
        fireDate?: Date;
        hireDate: Date;
        iDepartment: number;
        name: string;
        office: string;
        password: string;
        permAccounting: boolean;
        permAdmin: boolean;
        permCorporate: boolean;
        permFinances: boolean;
        permHuman: boolean;
        permMarketing: boolean;
        permOversee: boolean;
        phone: string;
      }[];
      vacancies: { description: string; iDepartment: number; requirements: string; title: string }[];
    }

    await this.departmentModel.sync().catch((err) => console.log(err));
    await this.usersModel.sync().catch((err) => console.log(err));
    await this.notificationsModel.sync().catch((err) => console.log(err));
    await this.resumesModel.sync().catch((err) => console.log(err));
    await this.vacanciesModel.sync().catch((err) => console.log(err));

    const file = await fs.readFile("files/InitFile.json");

    const fileData: fileData = JSON.parse(file.toString());

    for (let i = 0; i < fileData.departments.length; i++) {
      const { name, description } = fileData.departments[i];

      const departmentExists = await this.departmentModel.findOne({ where: { name } }).catch((err) => console.log(err));

      if (!departmentExists) {
        await this.departmentModel.create({ name, description }).catch((err) => console.log(err));
      }
    }

    for (let i = 0; i < fileData.users.length; i++) {
      const {
        active,
        address,
        addressCity,
        addressDistrict,
        addressNumber,
        addressState,
        addressZipCode,
        birthDate,
        cpf,
        email,
        hireDate,
        iDepartment,
        name,
        office,
        password,
        permAccounting,
        permAdmin,
        permCorporate,
        permFinances,
        permHuman,
        permMarketing,
        permOversee,
        phone,
      } = fileData.users[i];

      const userExists = await this.usersModel.findOne({ where: { email } }).catch((err) => console.log(err));

      if (!userExists) {
        const hash = await argon.hash(password);

        await this.usersModel
          .create({
            active,
            address,
            addressCity,
            addressDistrict,
            addressNumber,
            addressState,
            addressZipCode,
            birthDate: new Date(birthDate),
            cpf,
            email,
            hireDate: new Date(hireDate),
            iDepartment,
            name,
            office,
            password: hash,
            permAccounting,
            permAdmin,
            permCorporate,
            permFinances,
            permHuman,
            permMarketing,
            permOversee,
            phone,
          })
          .catch((err) => console.log(err));
      }
    }

    for (let i = 0; i < fileData.vacancies.length; i++) {
      const { description, iDepartment, requirements, title } = fileData.vacancies[i];

      await this.vacanciesModel
        .create({ description, iDepartment, requirements, title })
        .catch((err) => console.log(err));
    }
  }
}
