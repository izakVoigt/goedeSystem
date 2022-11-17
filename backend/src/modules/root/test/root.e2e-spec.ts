import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../../../app.module";

describe("Department module", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  it("/ (GET)", async () => {
    const req = await request(app.getHttpServer()).get("/");

    expect(req.statusCode).toEqual(200);
    expect(req.body.message).toEqual("Goede API v1.0");
  });

  it("/lgpd/form (GET)", async () => {
    const req = await request(app.getHttpServer()).get("/lgpd/form");

    expect(req.statusCode).toEqual(200);
    expect(req.type).toEqual("application/pdf");
  });
});
