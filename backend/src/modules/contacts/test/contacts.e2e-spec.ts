import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import * as request from "supertest";
import { AppModule } from "../../../app.module";
import { DepartmentsService } from "../../departments/departments.service";
import { UsersService } from "../../users/users.service";
import { NotificationsService } from "../../notifications/notifications.service";
import { brazilianStates } from "../../../util/enum/brazilianStates.enum";

describe("Contacts module", () => {
  let app: INestApplication;
  let departmentsService: DepartmentsService;
  let usersService: UsersService;
  let notificationsService: NotificationsService;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    usersService = module.get<UsersService>(UsersService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
    sequelize = module.get<Sequelize>(Sequelize);

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
  const createUser01 = async () => {
    await usersService.create({
      address: "Test 01",
      addressCity: "Test 01",
      addressDistrict: "Test 01",
      addressNumber: 123,
      addressState: brazilianStates.SC,
      addressZipCode: "00000-000",
      birthDate: "01-01-2000",
      cpf: "111.111.111-11",
      email: "tecnico01@goedeassessoria.com.br",
      hireDate: "01-01-2000",
      iDepartment: 1,
      name: "Test 01",
      office: "Test 01",
      password: "Test.12345",
      permAccounting: true,
      permAdmin: true,
      permCorporate: true,
      permFinances: true,
      permHuman: true,
      permMarketing: true,
      permOversee: true,
      phone: "(00)00000-0000",
    });
  };
  const createUser02 = async () => {
    await usersService.create({
      address: "Test 01",
      addressCity: "Test 01",
      addressDistrict: "Test 01",
      addressNumber: 123,
      addressState: brazilianStates.SC,
      addressZipCode: "00000-000",
      birthDate: "01-01-2000",
      cpf: "111.111.111-11",
      email: "test@test.com",
      hireDate: "01-01-2000",
      iDepartment: 1,
      name: "Test 01",
      office: "Test 01",
      password: "Test.12345",
      permAccounting: true,
      permAdmin: true,
      permCorporate: true,
      permFinances: true,
      permHuman: true,
      permMarketing: true,
      permOversee: true,
      phone: "(00)00000-0000",
    });
  };
  const createNotification01 = async () => {
    await notificationsService.create({
      iUser: 1,
      notificationClient: true,
      notificationContact: true,
      notificationResume: true,
    });
  };
  const createNotification02 = async () => {
    await notificationsService.create({
      iUser: 2,
      notificationClient: false,
      notificationContact: false,
      notificationResume: false,
    });
  };

  describe("/contacts/message (POST)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      await createDepartment();
      await createUser01();
      await createUser02();
    });

    it("should send contact message", async () => {
      await createNotification01();
      await createNotification02();

      const data = {
        name: "Test",
        email: "test@test.com",
        phone: "(00) 00000-0000",
        subject: "Test",
        message: "Test",
        terms: true,
      };

      const response = await request(app.getHttpServer()).post("/contacts/message").send(data);

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Mensagem enviada com sucesso");
    }, 30000);

    it("should try to send contact message without accept terms", async () => {
      const data = {
        name: "Test",
        email: "test@test.com",
        phone: "(00) 00000-0000",
        subject: "Test",
        message: "Test",
        terms: false,
      };

      const response = await request(app.getHttpServer()).post("/contacts/message").send(data);

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual("Aceite os termos de privacidade para enviar a mensagem");
    });

    it("should try to send contact message without any notifications registered", async () => {
      await createNotification02();

      const data = {
        name: "Test",
        email: "test@test.com",
        phone: "(00) 00000-0000",
        subject: "Test",
        message: "Test",
        terms: true,
      };

      const response = await request(app.getHttpServer()).post("/contacts/message").send(data);

      expect(response.statusCode).toEqual(500);
      expect(response.body.message).toEqual("Erro ao enviar mensagem, tente novamente mais tarde");
    });
  });
});
