import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import * as request from "supertest";
import { AppModule } from "../../../app.module";

describe("Permissions auth module", () => {
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

  describe("/permissions/:id (GET)", () => {
    it("should try to get notification id 1 data without authentication", async () => {
      const response = await request(app.getHttpServer()).get("/permissions/1");

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/permissions (POST)", () => {
    it("should try to create a new notification without authentication", async () => {
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

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/permissions/:id (DELETE)", () => {
    it("should try to delete notification id 1 without authentication", async () => {
      const response = await request(app.getHttpServer()).delete("/permissions/1");

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/permissions/:id (PATCH)", () => {
    it("should try to update notification id 1 without authentication", async () => {
      const data = {
        permOversee: true,
      };

      const response = await request(app.getHttpServer()).patch("/permissions/1").send(data);

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/permissions/:id (PUT)", () => {
    it("should try to update permissions id 1 without authentication", async () => {
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

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });
});
