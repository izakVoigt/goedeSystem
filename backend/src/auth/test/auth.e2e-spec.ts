import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import * as request from "supertest";
import { AppModule } from "../../app.module";
import { DepartmentsService } from "../../modules/departments/departments.service";
import { UsersService } from "../../modules/users/users.service";
import { brazilianStates } from "../../util/enum/brazilianStates.enum";

describe("Auth module", () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let departmentsService: DepartmentsService;
  let usersService: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    sequelize = module.get<Sequelize>(Sequelize);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    usersService = module.get<UsersService>(UsersService);

    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await sequelize.dropAllSchemas({ logging: false });
    await sequelize.sync();
    await app.close();
  });

  const createDepartment = async () => {
    await departmentsService.create({
      description: "Test 01",
      name: "Test 01",
    });
  };
  const createUser01 = async () => {
    await usersService.create({
      address: "Test 01",
      addressCity: "Test 01",
      addressDistrict: "Test 01",
      addressNumber: 123,
      addressState: brazilianStates.SC,
      addressZipCode: "00000-00",
      birthDate: "01-01-1111",
      cpf: "111.111.111-11",
      email: "test01@test.com",
      hireDate: "01-01-1111",
      iDepartment: 1,
      name: "Test 01",
      office: "Test 01",
      password: "Test.123456",
      phone: "(00)00000-0000",
    });
  };

  describe("/auth/login (POST)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should login and return a valid token", async () => {
      await createDepartment();
      await createUser01();

      const data = {
        email: "test01@test.com",
        password: "Test.123456",
      };

      const response = await request(app.getHttpServer()).post("/auth/login").send(data);

      expect(response.statusCode).toEqual(200);
      expect(response.body.accessToken).toEqual(expect.any(String));
    });

    it("should try to login with an invalid email", async () => {
      await createDepartment();
      await createUser01();

      const data = {
        email: "test02@test.com",
        password: "Test.123456",
      };

      const response = await request(app.getHttpServer()).post("/auth/login").send(data);

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual("E-mail ou senha inválidos");
    });

    it("should try to login with an invalid password", async () => {
      await createDepartment();
      await createUser01();

      const data = {
        email: "test01@test.com",
        password: "Test.123456789",
      };

      const response = await request(app.getHttpServer()).post("/auth/login").send(data);

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual("E-mail ou senha inválidos");
    });
  });
});
