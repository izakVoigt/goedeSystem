import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import * as request from "supertest";
import { AppModule } from "../../../app.module";

describe("Department auth module", () => {
  let app: INestApplication;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    sequelize = module.get<Sequelize>(Sequelize);

    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await sequelize.dropAllSchemas({ logging: false });
    await sequelize.sync();
    await app.close();
  });

  describe("/departments (GET)", () => {
    it("should try to get departments list without authentication", async () => {
      const response = await request(app.getHttpServer()).get("/departments");

      expect(response.statusCode).toEqual(200);
    });
  });

  describe("/departments/:id (GET)", () => {
    it("should try to get department id 1 data without authentication", async () => {
      const response = await request(app.getHttpServer()).get("/departments/1");

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/departments (POST)", () => {
    it("should try to create a new department without authentication", async () => {
      const data = {
        description: "Test",
        name: "Test",
      };

      const response = await request(app.getHttpServer()).post("/departments").send(data);

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/departments/:id (DELETE)", () => {
    it("should try to delete department id 1 without authentication", async () => {
      const response = await request(app.getHttpServer()).delete("/departments/1");

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/departments/:id (PATCH)", () => {
    it("should try to update department id 1 without authentication", async () => {
      const data = {
        description: "Test",
      };

      const response = await request(app.getHttpServer()).patch("/departments/1").send(data);

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/departments/:id (PUT)", () => {
    it("should try to update department id 1 without authentication", async () => {
      const data = {
        description: "Test",
        name: "Test",
      };

      const response = await request(app.getHttpServer()).put("/departments/1").send(data);

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });
});
