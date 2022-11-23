import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import * as request from "supertest";
import { AppModule } from "../../../app.module";
import { DepartmentsService } from "../departments.service";
import { JwtGuard } from "../../../auth/guard";
import { mockJwtGuard } from "../../../util/test/mockJwtGuard";

describe("Department module", () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let service: DepartmentsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtGuard)
      .useValue(mockJwtGuard)
      .compile();

    sequelize = module.get<Sequelize>(Sequelize);
    service = module.get<DepartmentsService>(DepartmentsService);

    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await sequelize.dropAllSchemas({ logging: false });
    await sequelize.sync();
    await app.close();
  });

  const createDepartment = async () => {
    await service.create({
      description: "Test 01",
      name: "Test 01",
    });
  };
  const createDepartment02 = async () => {
    await service.create({
      description: "Test 02",
      name: "Test 02",
    });
  };

  describe("/departments (GET)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should list all departments with 1 department", async () => {
      await createDepartment();

      const response = await request(app.getHttpServer()).get("/departments?page=1&limit=10");

      expect(response.statusCode).toEqual(200);
    });

    it("should list all departments with name query", async () => {
      await createDepartment();

      const response = await request(app.getHttpServer()).get("/departments?page=1&limit=10&name=Test");

      expect(response.statusCode).toEqual(200);
    });

    it("should list all departments with an empty list", async () => {
      const response = await request(app.getHttpServer()).get("/departments?page=1&limit=10");

      expect(response.statusCode).toEqual(200);
      expect(response.body.length).toEqual(0);
    });
  });

  describe("/departments/:id (GET)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should get department id 1 data", async () => {
      await createDepartment();

      const response = await request(app.getHttpServer()).get("/departments/1");

      expect(response.statusCode).toEqual(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.description).toEqual("Test 01");
      expect(response.body.name).toEqual("Test 01");
    });

    it("should try to get a department with an invalid id", async () => {
      const response = await request(app.getHttpServer()).get("/departments/1");

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Departamento não encontrado");
    });
  });

  describe("/departments (POST)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should create a new department", async () => {
      const data = {
        description: "Test",
        name: "Test",
      };

      const response = await request(app.getHttpServer()).post("/departments").send(data);

      const validation = await service.data(1);

      expect(response.statusCode).toEqual(201);
      expect(response.body.message).toEqual("Departamento criado com sucesso");
      expect(validation.id).toEqual(1);
      expect(validation.name).toEqual(data.name);
      expect(validation.description).toEqual(data.description);
    });

    it("should try to create a new department with an invalid name", async () => {
      await createDepartment();

      const data = {
        description: "Test 01",
        name: "Test 01",
      };

      const response = await request(app.getHttpServer()).post("/departments").send(data);

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual("Departamento já existente");
    });
  });

  describe("/departments/:id (DELETE)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should delete department id 1", async () => {
      await createDepartment();

      const response = await request(app.getHttpServer()).delete("/departments/1");

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Departamento excluído com sucesso");
    });

    it("should try to delete a department with an invalid id", async () => {
      const response = await request(app.getHttpServer()).delete("/departments/1");

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Departamento não encontrado");
    });
  });

  describe("/departments/:id (PATCH)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should update the description of department id 1", async () => {
      await createDepartment();

      const data = {
        description: "Test 02",
      };

      const response = await request(app.getHttpServer()).patch("/departments/1").send(data);

      const validation = await service.data(1);

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Departamento alterado com sucesso");
      expect(validation.description).toEqual(data.description);
    });

    it("should update the name of department id 1", async () => {
      await createDepartment();

      const data = {
        name: "Test 02",
      };

      const response = await request(app.getHttpServer()).patch("/departments/1").send(data);

      const validation = await service.data(1);

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Departamento alterado com sucesso");
      expect(validation.name).toEqual(data.name);
    });

    it("should try to update department with an invalid name", async () => {
      await createDepartment();
      await createDepartment02();

      const data = {
        name: "Test 01",
      };

      const response = await request(app.getHttpServer()).patch("/departments/2").send(data);

      const validation = await service.data(2);

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual("Departamento já existente");
      expect(validation.name).toEqual("Test 02");
    });

    it("should try to update department with an invalid id", async () => {
      await createDepartment();

      const data = {
        name: "Test 02",
      };

      const response = await request(app.getHttpServer()).patch("/departments/2").send(data);

      const validation = await service.data(1);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Departamento não encontrado");
      expect(validation.name).toEqual("Test 01");
    });
  });

  describe("/departments/:id (PUT)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should update department id 1", async () => {
      await createDepartment();

      const data = {
        description: "Test 02",
        name: "Test 02",
      };

      const response = await request(app.getHttpServer()).put("/departments/1").send(data);

      const validation = await service.data(1);

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Departamento alterado com sucesso");
      expect(validation.description).toEqual(data.description);
      expect(validation.name).toEqual(data.name);
    });

    it("should try to update department id 1 with an invalid name", async () => {
      await createDepartment();
      await createDepartment02();

      const data = {
        description: "Test 02",
        name: "Test 02",
      };

      const response = await request(app.getHttpServer()).put("/departments/1").send(data);

      const validation = await service.data(1);

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual("Departamento já existente");
      expect(validation.description).toEqual("Test 01");
      expect(validation.name).toEqual("Test 01");
    });

    it("should try to update a department with an invalid id", async () => {
      await createDepartment();

      const data = {
        description: "Test 02",
        name: "Test 02",
      };

      const response = await request(app.getHttpServer()).put("/departments/2").send(data);

      const validation = await service.data(1);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Departamento não encontrado");
      expect(validation.description).toEqual("Test 01");
      expect(validation.name).toEqual("Test 01");
    });
  });
});
