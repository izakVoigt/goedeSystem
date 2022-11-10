import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { SequelizeModule } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { ContactsController } from "../contacts.controller";
import { ContactsModule } from "../contacts.module";
import { DepartmentsModule } from "../../departments/departments.module";
import { UsersModule } from "../../users/users.module";
import { NotificationsModule } from "../../notifications/notifications.module";
import { DepartmentsService } from "../../departments/departments.service";
import { UsersService } from "../../users/users.service";
import { NotificationsService } from "../../notifications/notifications.service";
import { Departments } from "../../departments/model/departments.model";
import { Users } from "../../users/model/users.model";
import { Notifications } from "../../notifications/model/notifications.model";
import { MessageContactDto } from "../dto";
import { brazilianStates } from "../../../util/enum/brazilianStates.enum";
import { databaseOptions } from "../../../config/database.config";

describe("Contacts module", () => {
  let controller: ContactsController;
  let departmentsService: DepartmentsService;
  let usersService: UsersService;
  let notificationsService: NotificationsService;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ContactsModule,
        DepartmentsModule,
        UsersModule,
        NotificationsModule,
        SequelizeModule.forRoot(databaseOptions),
        SequelizeModule.forFeature([Departments, Users, Notifications]),
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    usersService = module.get<UsersService>(UsersService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
    sequelize = module.get<Sequelize>(Sequelize);
  });
  afterAll(async () => {
    await sequelize.dropAllSchemas({ logging: false });
    await sequelize.sync();
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

  describe("Send contact message", () => {
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

      const dto: MessageContactDto = {
        name: "Test",
        email: "test@test.com",
        phone: "(00) 00000-0000",
        subject: "Test",
        message: "Test",
        terms: true,
      };

      const req = await controller.sendMessageContact(dto);

      expect(req.message).toEqual("Mensagem enviada com sucesso");
    });

    it("should try to send contact message without accept terms", async () => {
      await createNotification01();
      await createNotification02();

      const dto: MessageContactDto = {
        name: "Test",
        email: "test@test.com",
        phone: "(00) 00000-0000",
        subject: "Test",
        message: "Test",
        terms: false,
      };

      await expect(controller.sendMessageContact(dto)).rejects.toThrow(
        new BadRequestException("Aceite os termos de privacidade para enviar a mensagem"),
      );
    });

    it("should try to send contact message with any notification", async () => {
      await createNotification02();

      const dto: MessageContactDto = {
        name: "Test",
        email: "test@test.com",
        phone: "(00) 00000-0000",
        subject: "Test",
        message: "Test",
        terms: true,
      };

      await expect(controller.sendMessageContact(dto)).rejects.toThrow(
        new InternalServerErrorException("Erro ao enviar mensagem, tente novamente mais tarde"),
      );
    });
  });
});
