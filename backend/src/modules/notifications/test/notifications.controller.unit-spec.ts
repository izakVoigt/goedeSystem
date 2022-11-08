import { Test, TestingModule } from "@nestjs/testing";
import { CreateNotificationDto, UpdateNotificationPatchDto, UpdateNotificationPutDto } from "../dto";
import { NotificationsController } from "../notifications.controller";
import { NotificationsService } from "../notifications.service";

describe("Notifications controller", () => {
  let controller: NotificationsController;

  const mockNotificationsService = {
    create: jest.fn((Cdto: CreateNotificationDto) => {
      if (Cdto.iUser === 3) {
        return {
          statusCode: 400,
          message: "Usuário já tem notificações cadastradas",
        };
      }
      if (Cdto.iUser === 2) {
        return {
          statusCode: 404,
          message: "Usuário não encontrado",
        };
      }

      return {
        statusCode: 201,
        message: "Notificação criada com sucesso",
      };
    }),
    data: jest.fn((id: number) => {
      if (id === 1) {
        return {
          statusCode: 200,
          data: {
            id: 1,
            createdAt: new Date(),
            iUser: 1,
            notificationClient: true,
            notificationContact: true,
            notificationResume: true,
            updatedAt: new Date(),
          },
        };
      }
      if (id === 2) {
        return {
          statusCode: 404,
          message: "Notificação não encontrada",
        };
      }
    }),
    destroy: jest.fn((id: number) => {
      if (id === 1) {
        return {
          statusCode: 200,
          message: "Notificação excluída com sucesso",
        };
      }
      if (id === 2) {
        return {
          statusCode: 404,
          message: "Notificação não encontrada",
        };
      }
    }),
    list: jest.fn(() => {
      return {
        statusCode: 200,
        list: [
          {
            id: 1,
            createdAt: new Date(),
            iUser: 1,
            notificationClient: true,
            notificationContact: true,
            notificationResume: true,
            updatedAt: new Date(),
          },
        ],
      };
    }),
    updatePatch: jest.fn((id: number) => {
      if (id === 1) {
        return {
          statusCode: 200,
          message: "Notificação alterada com sucesso",
        };
      }
      if (id === 2) {
        return {
          statusCode: 404,
          message: "Notificação não encontrada",
        };
      }
    }),
    updatePut: jest.fn((id: number) => {
      if (id === 1) {
        return {
          statusCode: 200,
          message: "Notificação alterada com sucesso",
        };
      }
      if (id === 2) {
        return {
          statusCode: 404,
          message: "Notificação não encontrada",
        };
      }
    }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [NotificationsService],
    })
      .overrideProvider(NotificationsService)
      .useValue(mockNotificationsService)
      .compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  describe("DELETE notification", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to delete a notification with an invalid id", () => {
      const id = 2;

      expect(controller.destroy(id)).toEqual({ statusCode: 404, message: "Notificação não encontrada" });
      expect(mockNotificationsService.destroy).toBeCalledTimes(1);
      expect(mockNotificationsService.destroy).toBeCalledWith(id);
    });

    it("should delete the notification with id 1", () => {
      const id = 1;

      expect(controller.destroy(id)).toEqual({ statusCode: 200, message: "Notificação excluída com sucesso" });
      expect(mockNotificationsService.destroy).toBeCalledTimes(1);
      expect(mockNotificationsService.destroy).toBeCalledWith(id);
    });
  });

  describe("GET notifications list", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should get the notifications list", () => {
      expect(controller.list()).toEqual({
        statusCode: 200,
        list: [
          {
            id: 1,
            createdAt: expect.any(Date),
            iUser: 1,
            notificationClient: true,
            notificationContact: true,
            notificationResume: true,
            updatedAt: expect.any(Date),
          },
        ],
      });
      expect(mockNotificationsService.list).toBeCalledTimes(1);
    });
  });

  describe("GET notification data", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to get the notification with an invalid id", () => {
      const id = 2;

      expect(controller.data(id)).toEqual({ statusCode: 404, message: "Notificação não encontrada" });
      expect(mockNotificationsService.data).toBeCalledTimes(1);
      expect(mockNotificationsService.data).toBeCalledWith(id);
    });

    it("should get the notification data by id", () => {
      const id = 1;

      expect(controller.data(id)).toEqual({
        statusCode: 200,
        data: {
          id: 1,
          createdAt: expect.any(Date),
          iUser: 1,
          notificationClient: true,
          notificationContact: true,
          notificationResume: true,
          updatedAt: expect.any(Date),
        },
      });
      expect(mockNotificationsService.data).toBeCalledTimes(1);
      expect(mockNotificationsService.data).toBeCalledWith(id);
    });
  });

  describe("PATCH notification", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to update with an invalid id", () => {
      const id = 2;
      const Udto: UpdateNotificationPatchDto = {
        notificationClient: false,
      };

      expect(controller.updatePatch(id, Udto)).toEqual({ statusCode: 404, message: "Notificação não encontrada" });
      expect(mockNotificationsService.updatePatch).toBeCalledTimes(1);
      expect(mockNotificationsService.updatePatch).toBeCalledWith(id, Udto);
    });

    it("should update the notification", () => {
      const id = 1;
      const Udto: UpdateNotificationPatchDto = {
        notificationClient: false,
      };

      expect(controller.updatePatch(id, Udto)).toEqual({
        statusCode: 200,
        message: "Notificação alterada com sucesso",
      });
      expect(mockNotificationsService.updatePatch).toBeCalledTimes(1);
      expect(mockNotificationsService.updatePatch).toBeCalledWith(id, Udto);
    });
  });

  describe("POST notification", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to create a new notification with an invalid user", () => {
      const Cdto: CreateNotificationDto = {
        iUser: 2,
        notificationClient: true,
        notificationContact: true,
        notificationResume: true,
      };

      expect(controller.create(Cdto)).toEqual({ statusCode: 404, message: "Usuário não encontrado" });
      expect(mockNotificationsService.create).toBeCalledTimes(1);
      expect(mockNotificationsService.create).toBeCalledWith(Cdto);
    });

    it("should try to create a new notification with an already used user", () => {
      const Cdto: CreateNotificationDto = {
        iUser: 3,
        notificationClient: true,
        notificationContact: true,
        notificationResume: true,
      };

      expect(controller.create(Cdto)).toEqual({ statusCode: 400, message: "Usuário já tem notificações cadastradas" });
      expect(mockNotificationsService.create).toBeCalledTimes(1);
      expect(mockNotificationsService.create).toBeCalledWith(Cdto);
    });

    it("should create a new notification", () => {
      const Cdto: CreateNotificationDto = {
        iUser: 1,
        notificationClient: true,
        notificationContact: true,
        notificationResume: true,
      };

      expect(controller.create(Cdto)).toEqual({ statusCode: 201, message: "Notificação criada com sucesso" });
      expect(mockNotificationsService.create).toBeCalledTimes(1);
      expect(mockNotificationsService.create).toBeCalledWith(Cdto);
    });
  });

  describe("PUT notification", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to update with an invalid id", () => {
      const id = 2;
      const Udto: UpdateNotificationPutDto = {
        notificationClient: false,
        notificationContact: false,
        notificationResume: false,
      };

      expect(controller.updatePut(id, Udto)).toEqual({ statusCode: 404, message: "Notificação não encontrada" });
      expect(mockNotificationsService.updatePut).toBeCalledTimes(1);
      expect(mockNotificationsService.updatePut).toBeCalledWith(id, Udto);
    });

    it("should update the notification", () => {
      const id = 1;
      const Udto: UpdateNotificationPutDto = {
        notificationClient: false,
        notificationContact: false,
        notificationResume: false,
      };

      expect(controller.updatePut(id, Udto)).toEqual({ statusCode: 200, message: "Notificação alterada com sucesso" });
      expect(mockNotificationsService.updatePut).toBeCalledTimes(1);
      expect(mockNotificationsService.updatePut).toBeCalledWith(id, Udto);
    });
  });
});
