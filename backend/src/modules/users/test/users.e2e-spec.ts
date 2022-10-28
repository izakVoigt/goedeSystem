import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import * as request from "supertest";
import { AppModule } from "../../../app.module";
import { JwtGuard } from "../../../auth/guard";
import { mockJwtGuard } from "../../../util/test/mockJwtGuard";
import { DepartmentsService } from "../../departments/departments.service";
import { UsersService } from "../users.service";
import { brazilianStates } from "../../../util/enum/brazilianStates.enum";

describe("Users module", () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let departmentsService: DepartmentsService;
  let usersService: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtGuard)
      .useValue(mockJwtGuard)
      .compile();

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
      permAccounting: true,
      permAdmin: true,
      permCorporate: true,
      permFinances: true,
      permHuman: true,
      permMarketing: true,
      permOversee: true,
      phone: "(00)00000-0000",
    });
  };
  const createUser02 = async () => {
    await usersService.create({
      address: "Test 02",
      addressCity: "Test 02",
      addressDistrict: "Test 02",
      addressNumber: 123,
      addressState: brazilianStates.SC,
      addressZipCode: "00000-00",
      birthDate: "01-01-1111",
      cpf: "111.111.111-11",
      email: "test02@test.com",
      hireDate: "01-01-1111",
      iDepartment: 1,
      name: "Test 02",
      office: "Test 02",
      password: "Test.123456",
      permAccounting: true,
      permAdmin: true,
      permCorporate: true,
      permFinances: true,
      permHuman: true,
      permMarketing: true,
      permOversee: true,
      phone: "(00)00000-0000",
    });
  };

  describe("/users (GET)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should get users list with 1 user", async () => {
      await createDepartment();
      await createUser01();

      const response = await request(app.getHttpServer()).get("/users");

      expect(response.statusCode).toEqual(200);
      expect(response.body.list.length).toEqual(1);
    });

    it("should get users list without any user", async () => {
      const response = await request(app.getHttpServer()).get("/users");

      expect(response.statusCode).toEqual(200);
      expect(response.body.list.length).toEqual(0);
    });
  });

  describe("/users/:id (GET)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should get data from user id 1", async () => {
      await createDepartment();
      await createUser01();

      const response = await request(app.getHttpServer()).get("/users/1");

      expect(response.statusCode).toEqual(200);
      expect(response.body.data.id).toEqual(1);
      expect(response.body.data.email).toEqual("test01@test.com");
    });

    it("should try to get data from user with an invalid id", async () => {
      const response = await request(app.getHttpServer()).get("/users/1");

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Usuário não encontrado");
    });
  });

  describe("/users (POST)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should create a new user", async () => {
      await createDepartment();

      const data = {
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
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
        phone: "(00)00000-0000",
      };

      const response = await request(app.getHttpServer()).post("/users").send(data);

      const validation = await usersService.data(1);

      expect(response.statusCode).toEqual(201);
      expect(response.body.message).toEqual("Usuário criado com sucesso");
      expect(validation.data.id).toEqual(1);
      expect(validation.data.email).toEqual(data.email);
    });

    it("should try to create a new user with an invalid department", async () => {
      const data = {
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
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
        phone: "(00)00000-0000",
      };

      const response = await request(app.getHttpServer()).post("/users").send(data);

      const validation = await usersService.list();

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Departamento não encontrado");
      expect(validation.list.length).toEqual(0);
    });

    it("should try to create a new user with an invalid email", async () => {
      await createDepartment();
      await createUser01();

      const data = {
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
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
        phone: "(00)00000-0000",
      };

      const response = await request(app.getHttpServer()).post("/users").send(data);

      const validation = await usersService.list();

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual("E-mail já em uso");
      expect(validation.list.length).toEqual(1);
    });
  });

  describe("/users/:id (DELETE)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should delete the user id 1", async () => {
      await createDepartment();
      await createUser01();

      const response = await request(app.getHttpServer()).delete("/users/1");

      const validation = await usersService.list();

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Usuário excluído com sucesso");
      expect(validation.list.length).toEqual(0);
    });

    it("should try to delete an invalid user", async () => {
      const response = await request(app.getHttpServer()).delete("/users/1");

      const validation = await usersService.list();

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Usuário não encontrado");
      expect(validation.list.length).toEqual(0);
    });
  });

  describe("/users/:id (PATCH)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should update user id 1", async () => {
      await createDepartment();
      await createUser01();

      const data = {
        name: "Test 02",
        birthDate: "03-03-2003",
        hireDate: "03-03-2003",
        fireDate: "03-03-2003",
        password: "Test.123456789",
      };

      const response = await request(app.getHttpServer()).patch("/users/1").send(data);

      const validation = await usersService.data(1);

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Usuário alterado com sucesso");
      expect(validation.data.name).toEqual(data.name);
    });

    it("should try to update user with an invalid department id", async () => {
      await createDepartment();
      await createUser01();

      const data = {
        iDepartment: 2,
      };

      const response = await request(app.getHttpServer()).patch("/users/1").send(data);

      const validation = await usersService.data(1);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Departamento não encontrado");
      expect(validation.data.iDepartment).toEqual(1);
    });

    it("should try to update user with an invalid email", async () => {
      await createDepartment();
      await createUser01();
      await createUser02();

      const data = {
        email: "test02@test.com",
      };

      const response = await request(app.getHttpServer()).patch("/users/1").send(data);

      const validation = await usersService.data(1);

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual("E-mail já em uso");
      expect(validation.data.email).toEqual("test01@test.com");
    });

    it("should try to update user with an invalid id", async () => {
      await createDepartment();
      await createUser01();

      const data = {
        email: "test03@test.com",
      };

      const response = await request(app.getHttpServer()).patch("/users/2").send(data);

      const validation = await usersService.data(1);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Usuário não encontrado");
      expect(validation.data.email).toEqual("test01@test.com");
    });
  });

  describe("/users/:id (PUT)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should update user id 1", async () => {
      await createDepartment();
      await createUser01();

      const data = {
        address: "Test 02",
        addressCity: "Test 02",
        addressDistrict: "Test 02",
        addressNumber: 123,
        addressState: brazilianStates.SC,
        addressZipCode: "00000-00",
        birthDate: "01-01-1111",
        cpf: "111.111.111-11",
        email: "test02@test.com",
        fireDate: "01-01-1111",
        hireDate: "01-01-1111",
        iDepartment: 1,
        name: "Test 02",
        office: "Test 02",
        password: "Test.123456",
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
        phone: "(00)00000-0000",
      };

      const response = await request(app.getHttpServer()).put("/users/1").send(data);

      const validation = await usersService.data(1);

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Usuário alterado com sucesso");
      expect(validation.data.email).toEqual("test02@test.com");
      expect(validation.data.name).toEqual("Test 02");
    });

    it("should try to update user with an invalid department id", async () => {
      await createDepartment();
      await createUser01();

      const data = {
        address: "Test 02",
        addressCity: "Test 02",
        addressDistrict: "Test 02",
        addressNumber: 123,
        addressState: brazilianStates.SC,
        addressZipCode: "00000-00",
        birthDate: "01-01-1111",
        cpf: "111.111.111-11",
        email: "test02@test.com",
        fireDate: "01-01-1111",
        hireDate: "01-01-1111",
        iDepartment: 2,
        name: "Test 02",
        office: "Test 02",
        password: "Test.123456",
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
        phone: "(00)00000-0000",
      };

      const response = await request(app.getHttpServer()).put("/users/1").send(data);

      const validation = await usersService.data(1);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Departamento não encontrado");
      expect(validation.data.email).toEqual("test01@test.com");
      expect(validation.data.name).toEqual("Test 01");
    });

    it("should try to update user with an invalid email", async () => {
      await createDepartment();
      await createUser01();
      await createUser02();

      const data = {
        address: "Test 02",
        addressCity: "Test 02",
        addressDistrict: "Test 02",
        addressNumber: 123,
        addressState: brazilianStates.SC,
        addressZipCode: "00000-00",
        birthDate: "01-01-1111",
        cpf: "111.111.111-11",
        email: "test02@test.com",
        fireDate: "01-01-1111",
        hireDate: "01-01-1111",
        iDepartment: 1,
        name: "Test 02",
        office: "Test 02",
        password: "Test.123456",
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
        phone: "(00)00000-0000",
      };

      const response = await request(app.getHttpServer()).put("/users/1").send(data);

      const validation = await usersService.data(1);

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual("E-mail já em uso");
      expect(validation.data.email).toEqual("test01@test.com");
      expect(validation.data.name).toEqual("Test 01");
    });

    it("should try to update user wit an invalid id", async () => {
      await createDepartment();
      await createUser01();

      const data = {
        address: "Test 02",
        addressCity: "Test 02",
        addressDistrict: "Test 02",
        addressNumber: 123,
        addressState: brazilianStates.SC,
        addressZipCode: "00000-00",
        birthDate: "01-01-1111",
        cpf: "111.111.111-11",
        email: "test02@test.com",
        fireDate: "01-01-1111",
        hireDate: "01-01-1111",
        iDepartment: 1,
        name: "Test 02",
        office: "Test 02",
        password: "Test.123456",
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
        phone: "(00)00000-0000",
      };

      const response = await request(app.getHttpServer()).put("/users/2").send(data);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Usuário não encontrado");
    });
  });
});
