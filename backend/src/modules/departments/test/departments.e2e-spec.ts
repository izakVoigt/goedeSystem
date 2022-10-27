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

  describe("/departments (GET)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should list all departments with 1 department", async () => {
      await createDepartment();

      const response = await request(app.getHttpServer()).get("/departments");

      expect(response.statusCode).toEqual(200);
      expect(response.body.list[0].id).toEqual(1);
      expect(response.body.list[0].description).toEqual("Test 01");
      expect(response.body.list[0].name).toEqual("Test 01");
    });

    it("should list all departments with an empty list", async () => {
      const response = await request(app.getHttpServer()).get("/departments");

      expect(response.statusCode).toEqual(200);
      expect(response.body.list.length).toEqual(0);
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
      expect(response.body.data.id).toEqual(1);
      expect(response.body.data.description).toEqual("Test 01");
      expect(response.body.data.name).toEqual("Test 01");
    });
  });
});
