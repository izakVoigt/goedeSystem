import { BadRequestException, NotFoundException } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import { Departments } from "../../departments/model/departments.model";
import { Notifications } from "../model/notifications.model";
import { Users } from "../../users/model/users.model";
import { DepartmentsService } from "../../departments/departments.service";
import { DepartmentsModule } from "../../departments/departments.module";
import { UsersModule } from "../../users/users.module";
import { UsersService } from "../../users/users.service";
import { NotificationsController } from "../notifications.controller";
import { NotificationsModule } from "../notifications.module";
import { NotificationsService } from "../notifications.service";
import { CreateNotificationDto, UpdateNotificationPutDto, UpdateNotificationPatchDto } from "../dto";
import { databaseOptions } from "../../../config/database.config";
import { brazilianStates } from "../../../util/enum/brazilianStates.enum";

describe("Notifications module", () => {
  let controller: NotificationsController;
  let notificationsService: NotificationsService;
  let usersService: UsersService;
  let departmentsService: DepartmentsService;
  let sequelize: Sequelize;

  const createDepartment = async () => {
    await departmentsService.create({ description: "Test", name: "Test" });
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
      notificationResume: false,
    });
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DepartmentsModule,
        UsersModule,
        NotificationsModule,
        SequelizeModule.forRoot(databaseOptions),
        SequelizeModule.forFeature([Departments, Users, Notifications]),
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    notificationsService = module.get<NotificationsService>(NotificationsService);
    usersService = module.get<UsersService>(UsersService);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    sequelize = module.get<Sequelize>(Sequelize);
  });
  afterAll(async () => {
    await sequelize.dropAllSchemas({ logging: false });
    await sequelize.sync();
  });

  describe("Create notification", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      await createDepartment();
      await createUser();
    });

    it("should create a new notification", async () => {
      const Cdto: CreateNotificationDto = {
        iUser: 1,
        notificationClient: true,
        notificationContact: true,
        notificationResume: true,
      };

      const req = await controller.create(Cdto);
      const validation = await notificationsService.data(1);

      expect(req.message).toEqual("Notificação criada com sucesso");
      expect(validation.data.id).toEqual(1);
      expect(validation.data.iUser).toEqual(1);
      expect(validation.data.notificationClient).toEqual(true);
      expect(validation.data.notificationContact).toEqual(true);
      expect(validation.data.notificationResume).toEqual(true);
    });

    it("should try a new notification with an invalid user id", async () => {
      const Cdto: CreateNotificationDto = {
        iUser: 2,
        notificationClient: true,
        notificationContact: true,
        notificationResume: true,
      };

      const validation = await notificationsService.list();

      await expect(controller.create(Cdto)).rejects.toThrow(new NotFoundException("Usuário não encontrado"));
      expect(validation.list.length).toEqual(0);
    });

    it("should try to create a new notification with an already used user", async () => {
      await createNotification01();

      const Cdto: CreateNotificationDto = {
        iUser: 1,
        notificationClient: true,
        notificationContact: true,
        notificationResume: true,
      };

      const validation = await notificationsService.list();

      await expect(controller.create(Cdto)).rejects.toThrow(
        new BadRequestException("Usuário já tem notificações cadastradas"),
      );
      expect(validation.list.length).toEqual(1);
    });
  });

  describe("Data notification", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      await createDepartment();
      await createUser();
      await createNotification01();
    });

    it("should get notification data", async () => {
      const id = 1;

      const req = await controller.data(id);

      expect(req.data.id).toEqual(1);
      expect(req.data.iUser).toEqual(1);
      expect(req.data.notificationClient).toEqual(true);
      expect(req.data.notificationContact).toEqual(true);
      expect(req.data.notificationResume).toEqual(false);
    });

    it("should try to get a notification data with an invalid id", async () => {
      const id = 2;

      await expect(controller.data(id)).rejects.toThrow(new NotFoundException("Notificação não encontrada"));
    });
  });

  describe("Destroy notification", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      await createDepartment();
      await createUser();
      await createNotification01();
    });

    it("should destroy a notification", async () => {
      const id = 1;

      const req = await controller.destroy(id);
      const validation = await notificationsService.list();

      expect(req.message).toEqual("Notificação excluída com sucesso");
      expect(validation.list.length).toEqual(0);
    });

    it("should try to destroy a notification with an invalid id", async () => {
      const id = 2;

      const validation = await notificationsService.list();

      await expect(controller.destroy(id)).rejects.toThrow(new NotFoundException("Notificação não encontrada"));
      expect(validation.list.length).toEqual(1);
    });
  });

  describe("List notifications", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      await createDepartment();
      await createUser();
      await createNotification01();
    });

    it("should list all notifications", async () => {
      const req = await controller.list();

      expect(req.list.length).toEqual(1);
    });
  });

  describe("Update Patch notification", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      await createDepartment();
      await createUser();
      await createNotification01();
    });

    it("should update notification id 1", async () => {
      const id = 1;
      const Udto: UpdateNotificationPatchDto = {
        notificationClient: false,
      };

      const req = await controller.updatePatch(id, Udto);
      const validation = await notificationsService.data(1);

      expect(req.message).toEqual("Notificação alterada com sucesso");
      expect(validation.data.notificationClient).toEqual(false);
    });

    it("should try to update notification with an invalid id", async () => {
      const id = 2;
      const Udto: UpdateNotificationPatchDto = {
        notificationClient: false,
      };

      await expect(controller.updatePatch(id, Udto)).rejects.toThrow(
        new NotFoundException("Notificação não encontrada"),
      );
    });
  });

  describe("Update Put notification", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      await createDepartment();
      await createUser();
      await createNotification01();
    });

    it("should update notification id 1", async () => {
      const id = 1;
      const Udto: UpdateNotificationPutDto = {
        notificationClient: true,
        notificationContact: true,
        notificationResume: true,
      };

      const req = await controller.updatePut(id, Udto);
      const validation = await notificationsService.data(1);

      expect(req.message).toEqual("Notificação alterada com sucesso");
      expect(validation.data.notificationClient).toEqual(true);
      expect(validation.data.notificationContact).toEqual(true);
      expect(validation.data.notificationResume).toEqual(true);
    });

    it("should try update notification id with an invalid id", async () => {
      const id = 2;
      const Udto: UpdateNotificationPutDto = {
        notificationClient: true,
        notificationContact: true,
        notificationResume: true,
      };

      const validation = await notificationsService.data(1);

      await expect(controller.updatePut(id, Udto)).rejects.toThrow(new NotFoundException("Notificação não encontrada"));
      expect(validation.data.notificationClient).toEqual(true);
      expect(validation.data.notificationContact).toEqual(true);
      expect(validation.data.notificationResume).toEqual(false);
    });
  });
});
