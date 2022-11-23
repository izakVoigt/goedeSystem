import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import { brazilianStates } from "../../../util/enum/brazilianStates.enum";
import * as request from "supertest";
import { AppModule } from "../../../app.module";
import { JwtGuard } from "../../../auth/guard";
import { mockJwtGuard } from "../../../util/test/mockJwtGuard";
import { DepartmentsService } from "../../departments/departments.service";
import { UsersService } from "../../users/users.service";
import { NotificationsService } from "../notifications.service";

describe("Notifications module", () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let departmentsService: DepartmentsService;
  let usersService: UsersService;
  let notificationsService: NotificationsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtGuard)
      .useValue(mockJwtGuard)
      .compile();

    sequelize = module.get<Sequelize>(Sequelize);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    usersService = module.get<UsersService>(UsersService);
    notificationsService = module.get<NotificationsService>(NotificationsService);

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
  const createUser = async () => {
    await usersService.create({
      address: "Test 01",
      addressCity: "Test 01",
      addressDistrict: "Test 01",
      addressNumber: 123,
      addressState: brazilianStates.SC,
      addressZipCode: "00000-000",
      birthDate: "01-01-2000",
      cpf: "111.111.111-11",
      email: "test01@test.com",
      hireDate: "01-01-2000",
      iDepartment: 1,
      name: "Test 01",
      office: "Test 01",
      password: "Test.12345",
      phone: "(00)00000-0000",
    });
  };
  const createNotification = async () => {
    await notificationsService.create({
      iUser: 1,
      notificationClient: true,
      notificationContact: true,
      notificationResume: true,
    });
  };

  describe("/notifications/:id (GET)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      await createDepartment();
      await createUser();
      await createNotification();
    });

    it("should get data from notification id 1", async () => {
      const response = await request(app.getHttpServer()).get("/notifications/1");

      expect(response.statusCode).toEqual(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.iUser).toEqual(1);
    });

    it("should try to get data from notification with an invalid id", async () => {
      const response = await request(app.getHttpServer()).get("/notifications/2");

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Notificação não encontrada");
    });
  });

  describe("/notifications (POST)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      await createDepartment();
      await createUser();
    });

    it("should create a new notification", async () => {
      const data = {
        iUser: 1,
        notificationClient: true,
        notificationContact: true,
        notificationResume: true,
      };

      const response = await request(app.getHttpServer()).post("/notifications").send(data);

      const validation = await notificationsService.data(1);

      expect(response.statusCode).toEqual(201);
      expect(response.body.message).toEqual("Notificação criada com sucesso");
      expect(validation.id).toEqual(1);
      expect(validation.iUser).toEqual(data.iUser);
      expect(validation.notificationClient).toEqual(data.notificationClient);
      expect(validation.notificationContact).toEqual(data.notificationContact);
      expect(validation.notificationResume).toEqual(data.notificationResume);
    });

    it("should try to create a new notification with an invalid user", async () => {
      const data = {
        iUser: 2,
        notificationClient: true,
        notificationContact: true,
        notificationResume: true,
      };

      const response = await request(app.getHttpServer()).post("/notifications").send(data);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Usuário não encontrado");
    });

    it("should try to create a new notification with an already used user", async () => {
      await createNotification();

      const data = {
        iUser: 1,
        notificationClient: true,
        notificationContact: true,
        notificationResume: true,
      };

      const response = await request(app.getHttpServer()).post("/notifications").send(data);

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual("Usuário já tem notificações cadastradas");
    });
  });

  describe("/notifications/:id (DELETE)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      await createDepartment();
      await createUser();
      await createNotification();
    });

    it("should delete the notification id 1", async () => {
      const response = await request(app.getHttpServer()).delete("/notifications/1");

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Notificação excluída com sucesso");
    });

    it("should try to delete an invalid notification", async () => {
      const response = await request(app.getHttpServer()).delete("/notifications/2");

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Notificação não encontrada");
    });
  });

  describe("/notifications/:id (PATCH)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      await createDepartment();
      await createUser();
      await createNotification();
    });

    it("should update notification id 1", async () => {
      const data = {
        notificationClient: false,
      };

      const response = await request(app.getHttpServer()).patch("/notifications/1").send(data);

      const validation = await notificationsService.data(1);

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Notificação alterada com sucesso");
      expect(validation.notificationClient).toEqual(data.notificationClient);
    });

    it("should try to update notification with an invalid id", async () => {
      const data = {
        notificationClient: false,
      };

      const response = await request(app.getHttpServer()).patch("/notifications/2").send(data);

      const validation = await notificationsService.data(1);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Notificação não encontrada");
      expect(validation.notificationClient).toEqual(true);
    });
  });

  describe("/notifications/:id (PUT)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      await createDepartment();
      await createUser();
      await createNotification();
    });

    it("should update notification id 1", async () => {
      const data = {
        notificationClient: false,
        notificationContact: false,
        notificationResume: false,
      };

      const response = await request(app.getHttpServer()).put("/notifications/1").send(data);

      const validation = await notificationsService.data(1);

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Notificação alterada com sucesso");
      expect(validation.notificationClient).toEqual(data.notificationClient);
      expect(validation.notificationContact).toEqual(data.notificationContact);
      expect(validation.notificationResume).toEqual(data.notificationResume);
    });

    it("should try to update notification with an invalid id", async () => {
      const data = {
        notificationClient: false,
        notificationContact: false,
        notificationResume: false,
      };

      const response = await request(app.getHttpServer()).put("/notifications/2").send(data);

      const validation = await notificationsService.data(1);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Notificação não encontrada");
      expect(validation.notificationClient).toEqual(true);
      expect(validation.notificationContact).toEqual(true);
      expect(validation.notificationResume).toEqual(true);
    });
  });
});
