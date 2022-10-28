import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import * as request from "supertest";
import { AppModule } from "../../../app.module";
import { brazilianStates } from "../../../util/enum/brazilianStates.enum";

describe("Users auth module", () => {
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

  describe("/users (GET)", () => {
    it("should try to get users list without authentication", async () => {
      const response = await request(app.getHttpServer()).get("/users");

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/users/:id (GET)", () => {
    it("should try to get user id 1 data without authentication", async () => {
      const response = await request(app.getHttpServer()).get("/users/1");

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/users (POST)", () => {
    it("should try to create a new users without authentication", async () => {
      const data = {
        address: "Test 01",
        addressCity: "Test 01",
        addressDistrict: "Test 01",
        addressNumber: 123,
        addressState: brazilianStates.SC,
        addressZipCode: "00000-00",
        birthDate: "01-01-1111",
        cpf: "111.111.111-11",
        email: "test01@test.com",
        hireDate: "01-01-1111",
        iusers: 1,
        name: "Test 01",
        office: "Test 01",
        password: "Test.123456",
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
        phone: "(00)00000-0000",
      };

      const response = await request(app.getHttpServer()).post("/users").send(data);

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/users/:id (DELETE)", () => {
    it("should try to delete users id 1 without authentication", async () => {
      const response = await request(app.getHttpServer()).delete("/users/1");

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/users/:id (PATCH)", () => {
    it("should try to update users id 1 without authentication", async () => {
      const data = {
        name: "Test 02",
        birthDate: "03-03-2003",
        hireDate: "03-03-2003",
        fireDate: "03-03-2003",
        password: "Test.123456789",
      };

      const response = await request(app.getHttpServer()).patch("/users/1").send(data);

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("/users/:id (PUT)", () => {
    it("should try to update users id 1 without authentication", async () => {
      const data = {
        address: "Test 02",
        addressCity: "Test 02",
        addressDistrict: "Test 02",
        addressNumber: 123,
        addressState: brazilianStates.SC,
        addressZipCode: "00000-00",
        birthDate: "01-01-1111",
        cpf: "111.111.111-11",
        email: "test02@test.com",
        fireDate: "01-01-1111",
        hireDate: "01-01-1111",
        iDepartment: 1,
        name: "Test 02",
        office: "Test 02",
        password: "Test.123456",
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
        phone: "(00)00000-0000",
      };

      const response = await request(app.getHttpServer()).put("/users/1").send(data);

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Unauthorized");
    });
  });
});
