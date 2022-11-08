import { BadRequestException, NotFoundException } from "@nestjs/common";
import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { DestroyOptions, FindOptions, UpdateOptions } from "sequelize";
import { NotificationsService } from "../notifications.service";
import { UsersService } from "../../users/users.service";
import { DepartmentsService } from "../../departments/departments.service";
import { INotificationsModel } from "../model/notifications.type.model";
import { IUsersModel } from "../../users/model/users.type.model";
import { IDepartmentsModel } from "../../departments/model/departments.type.model";
import { Notifications } from "../model/notifications.model";
import { Users } from "../../users/model/users.model";
import { Departments } from "../../departments/model/departments.model";
import { brazilianStates } from "../../../util/enum/brazilianStates.enum";

describe("Notifications service", () => {
  let service: NotificationsService;

  const notificationsTable: INotificationsModel[] = [];

  const usersTable: IUsersModel[] = [];

  const departmentsTable: IDepartmentsModel[] = [];

  const mockSequelizeDepartments = {
    findByPk: jest.fn((id: number) => {
      const department = departmentsTable.find((item) => item.id === id);

      return department;
    }),
  };

  const mockSequelizeUsers = {
    findByPk: jest.fn((id: number) => {
      const users = usersTable.find((item) => item.id === id);

      return users;
    }),
  };

  const mockSequelizeNotifications = {
    create: jest.fn(
      (iUser: number, notificationClient: boolean, notificationContact: boolean, notificationResume: boolean) => {
        notificationsTable.push({
          id: notificationsTable.length + 1,
          createdAt: new Date(),
          iUser,
          notificationClient,
          notificationContact,
          notificationResume,
          updatedAt: new Date(),
        });

        return notificationsTable.slice(-1);
      },
    ),
    destroy: jest.fn((options?: DestroyOptions<INotificationsModel>) => {
      // @ts-ignore
      const id: number = options.where.id;

      const itemIndex = notificationsTable.findIndex((item) => item.id === id);

      notificationsTable.splice(itemIndex, 1);
    }),
    findAll: jest.fn(() => {
      return notificationsTable;
    }),
    findByPk: jest.fn((id: number) => {
      const notification = notificationsTable.find((item) => item.id === id);

      return notification;
    }),
    findOne: jest.fn((options?: FindOptions<INotificationsModel>) => {
      // @ts-ignore
      const iUser: number = options.where.iUser;

      const notification = notificationsTable.find((item) => item.iUser === iUser);

      return notification;
    }),
    update: jest.fn(
      (
        values: {
          id?: number;
          createdAt?: Date;
          deletedAt?: Date;
          iUser?: number;
          notificationsClient?: boolean;
          notificationsContact?: boolean;
          notificationsResume?: boolean;
          updatedAt?: Date;
        },
        options?: UpdateOptions<INotificationsModel>,
      ) => {
        // @ts-ignore
        const id: number = options.where.id;

        const data = notificationsTable.findIndex((item) => item.id === id);

        if (values.iUser) {
          notificationsTable[data].iUser = values.iUser;
          notificationsTable[data].updatedAt = new Date();
        }
        if (values.notificationsClient) {
          notificationsTable[data].notificationClient = values.notificationsClient;
          notificationsTable[data].updatedAt = new Date();
        }
        if (values.notificationsContact) {
          notificationsTable[data].notificationContact = values.notificationsContact;
          notificationsTable[data].updatedAt = new Date();
        }
        if (values.notificationsResume) {
          notificationsTable[data].notificationResume = values.notificationsResume;
          notificationsTable[data].updatedAt = new Date();
        }
      },
    ),
  };

  const createNotification = () => {
    notificationsTable.push({
      id: notificationsTable.length + 1,
      createdAt: new Date(),
      iUser: 1,
      notificationClient: true,
      notificationContact: true,
      notificationResume: true,
      updatedAt: new Date(),
    });
  };

  beforeAll(async () => {
    departmentsTable.push({
      id: departmentsTable.length + 1,
      createdAt: new Date(),
      description: "Test",
      name: "Test",
      updatedAt: new Date(),
    });

    usersTable.push({
      id: usersTable.length + 1,
      active: true,
      address: "Test",
      addressCity: "Test",
      addressDistrict: "Test",
      addressNumber: 123,
      addressState: brazilianStates.SC,
      addressZipCode: "00000-000",
      birthDate: new Date(),
      cpf: "000.000.000-00",
      createdAt: new Date(),
      email: "test@test.com",
      hireDate: new Date(),
      iDepartment: 1,
      name: "Test",
      office: "Test",
      password: "Test",
      permAccounting: true,
      permAdmin: true,
      permCorporate: true,
      permFinances: true,
      permHuman: true,
      permMarketing: true,
      permOversee: true,
      phone: "(00) 00000-0000",
      updatedAt: new Date(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: getModelToken(Notifications), useValue: mockSequelizeNotifications },
        UsersService,
        { provide: getModelToken(Users), useValue: mockSequelizeUsers },
        DepartmentsService,
        { provide: getModelToken(Departments), useValue: mockSequelizeDepartments },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });
  afterAll(() => {
    notificationsTable.length = 0;
    usersTable.length = 0;
  });

  describe("Create notification", () => {
    afterAll(() => {
      notificationsTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should create a new notification", async () => {
      const req = await service.create({
        iUser: 1,
        notificationClient: true,
        notificationContact: true,
        notificationResume: true,
      });

      expect(req.message).toEqual("Notificação criada com sucesso");
      expect(mockSequelizeUsers.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeNotifications.findOne).toHaveBeenCalledTimes(1);
      expect(mockSequelizeNotifications.create).toHaveBeenCalledTimes(1);
    });

    it("should try to create a new notifications without user", async () => {
      await expect(
        service.create({
          iUser: 2,
          notificationClient: true,
          notificationContact: true,
          notificationResume: true,
        }),
      ).rejects.toThrow(new NotFoundException("Usuário não encontrado"));
      expect(mockSequelizeUsers.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeNotifications.findOne).toHaveBeenCalledTimes(0);
      expect(mockSequelizeNotifications.create).toHaveBeenCalledTimes(0);
    });

    it("should try to create a new notifications with user already used", async () => {
      await expect(
        service.create({
          iUser: 1,
          notificationClient: true,
          notificationContact: true,
          notificationResume: true,
        }),
      ).rejects.toThrow(new BadRequestException("Usuário já tem notificações cadastradas"));
      expect(mockSequelizeUsers.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeNotifications.findOne).toHaveBeenCalledTimes(1);
      expect(mockSequelizeNotifications.create).toHaveBeenCalledTimes(0);
    });
  });
});
