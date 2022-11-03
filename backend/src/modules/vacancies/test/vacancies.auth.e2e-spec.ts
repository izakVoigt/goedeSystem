import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import * as request from "supertest";
import { AppModule } from "../../../app.module";
import { DepartmentsService } from "../../departments/departments.service";
import { VacanciesService } from "../vacancies.service";

describe("Vacancies auth module", () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let departmentsService: DepartmentsService;
  let vacanciesService: VacanciesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

    it("should get vacancies list", async () => {
      await createDepartment();
      await createVacancy01();

      const response = await request(app.getHttpServer()).get("/vacancies");

      expect(response.statusCode).toEqual(200);
      expect(response.body.list.length).toEqual(1);
    });
  });

  describe("/vacancies/:id (GET)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should get vacancy id 1 data", async () => {
      await createDepartment();
      await createVacancy01();

      const response = await request(app.getHttpServer()).get("/vacancies/1");

      expect(response.statusCode).toEqual(200);
      expect(response.body.data.description).toEqual("Test 01");
    });
  });

  describe("/vacancies (POST)", () => {
    it("should try to create a new vacancy without authentication", async () => {
      const data = {
        description: "Test 01",
        iDepartment: 1,
        requirements: "Test 01",
        title: "Test 01",
      };

      const response = await request(app.getHttpServer()).post("/vacancies").send(data);

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/vacancies/:id (DELETE)", () => {
    it("should try to delete vacancy id 1 without authentication", async () => {
      const response = await request(app.getHttpServer()).delete("/vacancies/1");

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/vacancies/:id (PATCH)", () => {
    it("should try to update vacancy id 1 without authentication", async () => {
      const data = {
        description: "Test 01",
      };

      const response = await request(app.getHttpServer()).patch("/vacancies/1").send(data);

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/vacancies/:id (PUT)", () => {
    it("should try to update vacancy id 1 without authentication", async () => {
      const data = {
        description: "Test 01",
        iDepartment: 1,
        requirements: "Test 01",
        title: "Test 01",
      };

      const response = await request(app.getHttpServer()).put("/vacancies/1").send(data);

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });
});
