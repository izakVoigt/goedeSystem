import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import { brazilianStates } from "../../../util/enum/brazilianStates.enum";
import * as request from "supertest";
import { AppModule } from "../../../app.module";
import { JwtGuard } from "../../../auth/guard";
import { mockJwtGuard } from "../../../util/test/mockJwtGuard";
import { DepartmentsService } from "../../departments/departments.service";
import { UsersService } from "../../users/users.service";
import { PermissionsService } from "../permissions.service";

describe("permissions module", () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let departmentsService: DepartmentsService;
  let usersService: UsersService;
  let permissionsService: PermissionsService;

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
    permissionsService = module.get<PermissionsService>(PermissionsService);

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
  const createUser = async () => {
    await usersService.create({
      address: "Test 01",
      addressCity: "Test 01",
      addressDistrict: "Test 01",
      addressNumber: 123,
      addressState: brazilianStates.SC,
      addressZipCode: "00000-000",
      birthDate: "01-01-2000",
      cpf: "111.111.111-11",
      email: "test01@test.com",
      hireDate: "01-01-2000",
      iDepartment: 1,
      name: "Test 01",
      office: "Test 01",
      password: "Test.12345",
      phone: "(00)00000-0000",
    });
  };
  const createPermissions = async () => {
    await permissionsService.create({
      iUser: 1,
      permAccounting: false,
      permAdmin: false,
      permCorporate: false,
      permFinances: false,
      permHuman: false,
      permMarketing: false,
      permOversee: false,
    });
  };

  describe("/permissions/:id (GET)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      await createDepartment();
      await createUser();
      await createPermissions();
    });

    it("should get data from permission id 1", async () => {
      const response = await request(app.getHttpServer()).get("/permissions/1");

      expect(response.statusCode).toEqual(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.iUser).toEqual(1);
    });

    it("should try to get data from permission with an invalid id", async () => {
      const response = await request(app.getHttpServer()).get("/permissions/2");

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Permissão não encontrada");
    });
  });

  describe("/permissions (POST)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      await createDepartment();
      await createUser();
    });

    it("should create a new permission", async () => {
      const data = {
        iUser: 1,
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
      };

      const response = await request(app.getHttpServer()).post("/permissions").send(data);

      const validation = await permissionsService.data(1);

      expect(response.statusCode).toEqual(201);
      expect(response.body.message).toEqual("Permissões criadas com sucesso");
      expect(validation.id).toEqual(1);
      expect(validation.iUser).toEqual(data.iUser);
    });

    it("should try to create a new permission with an invalid user", async () => {
      const data = {
        iUser: 2,
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
      };

      const response = await request(app.getHttpServer()).post("/permissions").send(data);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Usuário não encontrado");
    });

    it("should try to create a new permission with an already used user", async () => {
      await createPermissions();

      const data = {
        iUser: 1,
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
      };

      const response = await request(app.getHttpServer()).post("/permissions").send(data);

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual("Usuário já tem permissões cadastradas");
    });
  });

  describe("/permissions/:id (DELETE)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      await createDepartment();
      await createUser();
      await createPermissions();
    });

    it("should delete the permission id 1", async () => {
      const response = await request(app.getHttpServer()).delete("/permissions/1");

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Permissão excluída com sucesso");
    });

    it("should try to delete an invalid permission", async () => {
      const response = await request(app.getHttpServer()).delete("/permissions/2");

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Permissão não encontrada");
    });
  });

  describe("/permissions/:id (PATCH)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      await createDepartment();
      await createUser();
      await createPermissions();
    });

    it("should update permission id 1", async () => {
      const data = {
        permOversee: true,
      };

      const response = await request(app.getHttpServer()).patch("/permissions/1").send(data);

      const validation = await permissionsService.data(1);

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Permissão alterada com sucesso");
      expect(validation.permOversee).toEqual(data.permOversee);
    });

    it("should try to update permission with an invalid id", async () => {
      const data = {
        permOversee: true,
      };

      const response = await request(app.getHttpServer()).patch("/permissions/2").send(data);

      const validation = await permissionsService.data(1);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Permissão não encontrada");
      expect(validation.permOversee).toEqual(false);
    });
  });

  describe("/permissions/:id (PUT)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      await createDepartment();
      await createUser();
      await createPermissions();
    });

    it("should update permission id 1", async () => {
      const data = {
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
      };

      const response = await request(app.getHttpServer()).put("/permissions/1").send(data);

      const validation = await permissionsService.data(1);

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Permissão alterada com sucesso");
      expect(validation.permOversee).toEqual(data.permOversee);
    });

    it("should try to update permission with an invalid id", async () => {
      const data = {
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
      };

      const response = await request(app.getHttpServer()).put("/permissions/2").send(data);

      const validation = await permissionsService.data(1);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Permissão não encontrada");
      expect(validation.permOversee).toEqual(false);
    });
  });
});
