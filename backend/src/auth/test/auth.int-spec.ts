import { BadRequestException } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";

import { AuthController } from "../auth.controller";
import { AuthModule } from "../auth.module";
import { Departments } from "../../modules/departments/model/departments.model";
import { DepartmentsModule } from "../../modules/departments/departments.module";
import { DepartmentsService } from "../../modules/departments/departments.service";
import { Users } from "../../modules/users/model/users.model";
import { UsersModule } from "../../modules/users/users.module";
import { UsersService } from "../../modules/users/users.service";
import { databaseOptions } from "../../config/database.config";
import { brazilianStates } from "../../util/enum/brazilianStates.enum";

describe("Auth module", () => {
  let controller: AuthController;
  let departmentsService: DepartmentsService;
  let sequelize: Sequelize;
  let usersService: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        DepartmentsModule,
        UsersModule,
        SequelizeModule.forRoot(databaseOptions),
        SequelizeModule.forFeature([Departments, Users]),
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({}),
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    sequelize = module.get<Sequelize>(Sequelize);
    usersService = module.get<UsersService>(UsersService);

    await departmentsService.create({ description: "Test", name: "Test" });
    await usersService.create({
      address: "Test 01",
      addressCity: "Test 01",
      addressDistrict: "Test 01",
      addressNumber: 123,
      addressState: brazilianStates.SC,
      addressZipCode: "00000-000",
      birthDate: "01-01-2000",
      cpf: "111-111-111.11",
      email: "test01@test.com",
      hireDate: "01-01-2000",
      iDepartment: 1,
      name: "Test 01",
      office: "Test 01",
      password: "Test.12345",
      permAccounting: true,
      permAdmin: true,
      permCorporate: true,
      permFinances: true,
      permHuman: true,
      permMarketing: true,
      permOversee: true,
      phone: "(00)00000-0000",
    });
  });
  afterAll(async () => {
    await sequelize.dropAllSchemas({ logging: false });
    await sequelize.sync();
  });

  describe("Login", () => {
    it("should send the email and password and return a token", async () => {
      const req = await controller.login({ email: "test01@test.com", password: "Test.12345" });

      expect(req.accessToken).toEqual(expect.any(String));
    });

    it("should send the right email and the wrong password", async () => {
      await expect(controller.login({ email: "test01@test.com", password: "Test.123456789" })).rejects.toThrow(
        new BadRequestException("E-mail ou senha inválidos"),
      );
    });

    it("should send the wrong email and the right password", async () => {
      await expect(controller.login({ email: "test02@test.com", password: "Test.123456" })).rejects.toThrow(
        new BadRequestException("E-mail ou senha inválidos"),
      );
    });
  });
});
