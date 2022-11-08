import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import * as request from "supertest";
import { AppModule } from "../../../app.module";

describe("notifications auth module", () => {
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

  describe("/notifications (GET)", () => {
    it("should try to get notifications list without authentication", async () => {
      const response = await request(app.getHttpServer()).get("/notifications");

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/notifications/:id (GET)", () => {
    it("should try to get notification id 1 data without authentication", async () => {
      const response = await request(app.getHttpServer()).get("/notifications/1");

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/notifications (POST)", () => {
    it("should try to create a new notification without authentication", async () => {
      const data = {
        iUser: 1,
        notificationClient: true,
        notificationContact: true,
        notificationResume: true,
      };

      const response = await request(app.getHttpServer()).post("/notifications").send(data);

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/notifications/:id (DELETE)", () => {
    it("should try to delete notification id 1 without authentication", async () => {
      const response = await request(app.getHttpServer()).delete("/notifications/1");

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/notifications/:id (PATCH)", () => {
    it("should try to update notification id 1 without authentication", async () => {
      const data = {
        notificationClient: false,
      };

      const response = await request(app.getHttpServer()).patch("/notifications/1").send(data);

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/notifications/:id (PUT)", () => {
    it("should try to update notifications id 1 without authentication", async () => {
      const data = {
        notificationClient: true,
        notificationContact: true,
        notificationResume: false,
      };

      const response = await request(app.getHttpServer()).put("/notifications/1").send(data);

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });
});
