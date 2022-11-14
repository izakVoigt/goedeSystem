import * as fs from "fs-extra";
import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import { AppModule } from "../../../app.module";
import { DepartmentsService } from "../../departments/departments.service";

describe("Resumes auth module", () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let departmentsService: DepartmentsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    sequelize = module.get<Sequelize>(Sequelize);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);

    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    fs.readdir("upload", (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(`upload/${file}`, (err) => {
          if (err) throw err;
        });
      }
    });
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

  describe("/resumes (GET)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should try to get resumes list without authentication", async () => {
      const response = await request(app.getHttpServer()).get("/resumes");

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/resumes/:id (GET)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should try to get vacancy id 1 data without authentication", async () => {
      const response = await request(app.getHttpServer()).get("/resumes/1");

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/resumes (POST)", () => {
    it("should create a new resume without", async () => {
      await createDepartment();

      const response = await request(app.getHttpServer())
        .post("/resumes")
        .field("email", "test@test.com")
        .field("iDepartment", "1")
        .field("name", "Test")
        .field("phone", "(00) 00000-0000")
        .attach("file", fs.createReadStream("src/util/test/testFile.pdf"));

      expect(response.statusCode).toEqual(201);
      expect(response.body.message).toEqual("Currículo cadastrado com sucesso");
    });
  });

  describe("/resumes/:id (DELETE)", () => {
    it("should try to delete resume id 1 without authentication", async () => {
      const response = await request(app.getHttpServer()).delete("/resumes/1");

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/resumes/:id (PATCH)", () => {
    it("should try to update resume id 1 without authentication", async () => {
      const data = {
        observations: "Test 01",
      };

      const response = await request(app.getHttpServer()).patch("/resumes/1").send(JSON.stringify(data));

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/resumes/:id (PUT)", () => {
    it("should try to update resume id 1 without authentication", async () => {
      const data = {
        iDepartment: 2,
        observations: "Test 01",
        revised: true,
      };

      const response = await request(app.getHttpServer()).put("/resumes/1").send(JSON.stringify(data));

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });
});
