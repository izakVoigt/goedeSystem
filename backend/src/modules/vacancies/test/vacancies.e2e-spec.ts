import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import * as request from "supertest";
import { AppModule } from "../../../app.module";
import { JwtGuard } from "../../../auth/guard";
import { mockJwtGuard } from "../../../util/test/mockJwtGuard";
import { DepartmentsService } from "../../departments/departments.service";
import { VacanciesService } from "../vacancies.service";

describe("vacancies module", () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let departmentsService: DepartmentsService;
  let vacanciesService: VacanciesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtGuard)
      .useValue(mockJwtGuard)
      .compile();

    sequelize = module.get<Sequelize>(Sequelize);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    vacanciesService = module.get<VacanciesService>(VacanciesService);

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
  const createVacancy01 = async () => {
    await vacanciesService.create({
      description: "Test 01",
      iDepartment: 1,
      requirements: "Test 01",
      title: "Test 01",
    });
  };

  describe("/vacancies (GET)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should get vacancies list with 1 vacancy", async () => {
      await createDepartment();
      await createVacancy01();

      const response = await request(app.getHttpServer()).get("/vacancies");

      expect(response.statusCode).toEqual(200);
      expect(response.body.list.length).toEqual(1);
    });

    it("should get vacancies list without any vacancy", async () => {
      const response = await request(app.getHttpServer()).get("/vacancies");

      expect(response.statusCode).toEqual(200);
      expect(response.body.list.length).toEqual(0);
    });
  });

  describe("/vacancies/:id (GET)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should get data from vacancy id 1", async () => {
      await createDepartment();
      await createVacancy01();

      const response = await request(app.getHttpServer()).get("/vacancies/1");

      expect(response.statusCode).toEqual(200);
      expect(response.body.data.id).toEqual(1);
      expect(response.body.data.description).toEqual("Test 01");
    });

    it("should try to get data from vacancy with an invalid id", async () => {
      const response = await request(app.getHttpServer()).get("/vacancies/1");

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Vaga não encontrada");
    });
  });

  describe("/vacancies (POST)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should create a new vacancy", async () => {
      await createDepartment();

      const data = {
        description: "Test",
        iDepartment: 1,
        requirements: "Test",
        title: "Test",
      };

      const response = await request(app.getHttpServer()).post("/vacancies").send(data);

      const validation = await vacanciesService.data(1);

      expect(response.statusCode).toEqual(201);
      expect(response.body.message).toEqual("Vaga criada com sucesso");
      expect(validation.data.id).toEqual(1);
      expect(validation.data.description).toEqual(data.description);
    });

    it("should try to create a new vacancy with an invalid department", async () => {
      const data = {
        description: "Test",
        iDepartment: 1,
        requirements: "Test",
        title: "Test",
      };

      const response = await request(app.getHttpServer()).post("/vacancies").send(data);

      const validation = await vacanciesService.list();

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Departamento não encontrado");
      expect(validation.list.length).toEqual(0);
    });
  });

  describe("/vacancies/:id (DELETE)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should delete the vacancy id 1", async () => {
      await createDepartment();
      await createVacancy01();

      const response = await request(app.getHttpServer()).delete("/vacancies/1");

      const validation = await vacanciesService.list();

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Vaga excluída com sucesso");
      expect(validation.list.length).toEqual(0);
    });

    it("should try to delete an invalid vacancy", async () => {
      const response = await request(app.getHttpServer()).delete("/vacancies/1");

      const validation = await vacanciesService.list();

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Vaga não encontrada");
      expect(validation.list.length).toEqual(0);
    });
  });

  describe("/vacancies/:id (PATCH)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should update vacancy id 1", async () => {
      await createDepartment();
      await createVacancy01();

      const data = {
        description: "Test",
      };

      const response = await request(app.getHttpServer()).patch("/vacancies/1").send(data);

      const validation = await vacanciesService.data(1);

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Vaga alterada com sucesso");
      expect(validation.data.description).toEqual(data.description);
    });

    it("should try to update vacancy with an invalid department id", async () => {
      await createDepartment();
      await createVacancy01();

      const data = {
        iDepartment: 2,
      };

      const response = await request(app.getHttpServer()).patch("/vacancies/1").send(data);

      const validation = await vacanciesService.data(1);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Departamento não encontrado");
      expect(validation.data.iDepartment).toEqual(1);
    });

    it("should try to update vacancy with an invalid id", async () => {
      await createDepartment();
      await createVacancy01();

      const data = {
        description: "Test 02",
      };

      const response = await request(app.getHttpServer()).patch("/vacancies/2").send(data);

      const validation = await vacanciesService.data(1);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Vaga não encontrada");
      expect(validation.data.description).toEqual("Test 01");
    });
  });

  describe("/vacancies/:id (PUT)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should update vacancy id 1", async () => {
      await createDepartment();
      await createVacancy01();

      const data = {
        description: "Test",
        iDepartment: 1,
        requirements: "Test",
        title: "Test",
      };

      const response = await request(app.getHttpServer()).put("/vacancies/1").send(data);

      const validation = await vacanciesService.data(1);

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Vaga alterada com sucesso");
      expect(validation.data.description).toEqual("Test");
      expect(validation.data.iDepartment).toEqual(1);
    });

    it("should try to update vacancy with an invalid department id", async () => {
      await createDepartment();
      await createVacancy01();

      const data = {
        description: "Test",
        iDepartment: 2,
        requirements: "Test",
        title: "Test",
      };

      const response = await request(app.getHttpServer()).put("/vacancies/1").send(data);

      const validation = await vacanciesService.data(1);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Departamento não encontrado");
      expect(validation.data.iDepartment).toEqual(1);
      expect(validation.data.requirements).toEqual("Test 01");
    });

    it("should try to update vacancy with an invalid id", async () => {
      await createDepartment();
      await createVacancy01();

      const data = {
        description: "Test 02",
        iDepartment: 1,
        requirements: "Test 02",
        title: "Test 02",
      };

      const response = await request(app.getHttpServer()).put("/vacancies/2").send(data);

      const validation = await vacanciesService.data(1);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Vaga não encontrada");
      expect(validation.data.description).toEqual("Test 01");
    });
  });
});
