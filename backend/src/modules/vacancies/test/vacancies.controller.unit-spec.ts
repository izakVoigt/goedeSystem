import { Test, TestingModule } from "@nestjs/testing";
import { CreateVacancyDto, UpdateVacancyPatchDto, UpdateVacancyPutDto } from "../dto";
import { VacanciesController } from "../vacancies.controller";
import { VacanciesService } from "../vacancies.service";

describe("Vacancies Controller", () => {
  let controller: VacanciesController;

  const mockVacancyService = {
    create: jest.fn((Cdto: CreateVacancyDto) => {
      if (Cdto.iDepartment === 1) {
        return {
          statusCode: 201,
          message: "Vaga criada com sucesso",
        };
      }
      if (Cdto.iDepartment === 2) {
        return {
          statusCode: 404,
          message: "Departamento não encontrado",
        };
      }
    }),
    data: jest.fn((id: number) => {
      if (id === 1) {
        return {
          statusCode: 200,
          data: {
            id: 1,
            createdAt: new Date(),
            description: "Test",
            iDepartment: 1,
            requirements: "Test",
            title: "Test",
            updatedAt: new Date(),
          },
        };
      }
      if (id === 2) {
        return {
          statusCode: 404,
          message: "Vaga não encontrada",
        };
      }
    }),
    destroy: jest.fn((id: number) => {
      if (id === 1) {
        return {
          statusCode: 200,
          message: "Vaga excluída com sucesso",
        };
      }
      if (id === 2) {
        return {
          statusCode: 404,
          message: "Vaga não encontrada",
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
            description: "Test",
            iDepartment: 1,
            requirements: "Test",
            title: "Test",
            updatedAt: new Date(),
          },
        ],
      };
    }),
    updatePatch: jest.fn((id: number, Udto: UpdateVacancyPatchDto) => {
      if ((id === 1 && !Udto.iDepartment) || (id === 1 && Udto.iDepartment === 1)) {
        return {
          statusCode: 200,
          message: "Vaga alterada com sucesso",
        };
      }
      if (id === 1 && Udto.iDepartment !== 1) {
        return {
          statusCode: 404,
          message: "Departamento não encontrado",
        };
      }
      if (id === 2) {
        return {
          statusCode: 404,
          message: "Vaga não encontrada",
        };
      }
    }),
    updatePut: jest.fn((id: number, Udto: UpdateVacancyPutDto) => {
      if (id === 1 && Udto.iDepartment === 1) {
        return {
          statusCode: 200,
          message: "Vaga alterada com sucesso",
        };
      }
      if (id !== 1 && Udto.iDepartment === 1) {
        return {
          statusCode: 404,
          message: "Vaga não encontrada",
        };
      }
      if (id === 1 && Udto.iDepartment !== 1) {
        return {
          statusCode: 404,
          message: "Departamento não encontrado",
        };
      }
    }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacanciesController],
      providers: [VacanciesService],
    })
      .overrideProvider(VacanciesService)
      .useValue(mockVacancyService)
      .compile();

    controller = module.get<VacanciesController>(VacanciesController);
  });

  describe("DELETE vacancy", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to delete a vacancy with an invalid id", () => {
      const id = 2;

      expect(controller.destroy(id)).toEqual({ statusCode: 404, message: "Vaga não encontrada" });
      expect(mockVacancyService.destroy).toBeCalledTimes(1);
      expect(mockVacancyService.destroy).toBeCalledWith(id);
    });

    it("should delete the vacancy with id 1", () => {
      const id = 1;

      expect(controller.destroy(id)).toEqual({ statusCode: 200, message: "Vaga excluída com sucesso" });
      expect(mockVacancyService.destroy).toBeCalledTimes(1);
      expect(mockVacancyService.destroy).toBeCalledWith(id);
    });
  });

  describe("GET vacancies list", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should get the vacancies list", () => {
      expect(controller.list()).toEqual({
        statusCode: 200,
        list: [
          {
            id: 1,
            createdAt: expect.any(Date),
            description: "Test",
            iDepartment: 1,
            requirements: "Test",
            title: "Test",
            updatedAt: expect.any(Date),
          },
        ],
      });
      expect(mockVacancyService.list).toBeCalledTimes(1);
    });
  });

  describe("GET vacancy data", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to get the vacancy with an invalid id", () => {
      const id = 2;

      expect(controller.data(id)).toEqual({ statusCode: 404, message: "Vaga não encontrada" });
      expect(mockVacancyService.data).toBeCalledTimes(1);
      expect(mockVacancyService.data).toBeCalledWith(id);
    });

    it("should get the vacancy data by id", () => {
      const id = 1;

      expect(controller.data(id)).toEqual({
        statusCode: 200,
        data: {
          id: 1,
          createdAt: expect.any(Date),
          description: "Test",
          iDepartment: 1,
          requirements: "Test",
          title: "Test",
          updatedAt: expect.any(Date),
        },
      });
      expect(mockVacancyService.data).toBeCalledTimes(1);
      expect(mockVacancyService.data).toBeCalledWith(id);
    });
  });

  describe("PATCH vacancy", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to update with an invalid id", () => {
      const id = 2;
      const Udto: UpdateVacancyPatchDto = {
        description: "New test",
        title: "New test",
      };

      expect(controller.updatePatch(id, Udto)).toEqual({ statusCode: 404, message: "Vaga não encontrada" });
      expect(mockVacancyService.updatePatch).toBeCalledTimes(1);
      expect(mockVacancyService.updatePatch).toBeCalledWith(id, Udto);
    });

    it("should try to update with an invalid department", () => {
      const id = 1;
      const Udto: UpdateVacancyPatchDto = {
        iDepartment: 2,
      };

      expect(controller.updatePatch(id, Udto)).toEqual({ statusCode: 404, message: "Departamento não encontrado" });
      expect(mockVacancyService.updatePatch).toBeCalledTimes(1);
      expect(mockVacancyService.updatePatch).toBeCalledWith(id, Udto);
    });

    it("should update the vacancy", () => {
      const id = 1;
      const Udto: UpdateVacancyPatchDto = {
        description: "New test",
      };

      expect(controller.updatePatch(id, Udto)).toEqual({ statusCode: 200, message: "Vaga alterada com sucesso" });
      expect(mockVacancyService.updatePatch).toBeCalledTimes(1);
      expect(mockVacancyService.updatePatch).toBeCalledWith(id, Udto);
    });
  });

  describe("POST vacancy", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to create a new vacancy with an invalid department", () => {
      const Cdto: CreateVacancyDto = {
        description: "Test",
        iDepartment: 2,
        requirements: "Test",
        title: "Test",
      };

      expect(controller.create(Cdto)).toEqual({ statusCode: 404, message: "Departamento não encontrado" });
      expect(mockVacancyService.create).toBeCalledTimes(1);
      expect(mockVacancyService.create).toBeCalledWith(Cdto);
    });

    it("should create a new vacancy", () => {
      const Cdto: CreateVacancyDto = {
        description: "Test",
        iDepartment: 1,
        requirements: "Test",
        title: "Test",
      };

      expect(controller.create(Cdto)).toEqual({ statusCode: 201, message: "Vaga criada com sucesso" });
      expect(mockVacancyService.create).toBeCalledTimes(1);
      expect(mockVacancyService.create).toBeCalledWith(Cdto);
    });
  });

  describe("PUT vacancy", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to update with an invalid id", () => {
      const id = 2;
      const Udto: UpdateVacancyPutDto = {
        description: "New test",
        iDepartment: 1,
        requirements: "New test",
        title: "New test",
      };

      expect(controller.updatePut(id, Udto)).toEqual({ statusCode: 404, message: "Vaga não encontrada" });
      expect(mockVacancyService.updatePut).toBeCalledTimes(1);
      expect(mockVacancyService.updatePut).toBeCalledWith(id, Udto);
    });

    it("should try to update with an invalid department", () => {
      const id = 1;
      const Udto: UpdateVacancyPutDto = {
        description: "New test",
        iDepartment: 2,
        requirements: "New test",
        title: "New test",
      };

      expect(controller.updatePut(id, Udto)).toEqual({ statusCode: 404, message: "Departamento não encontrado" });
      expect(mockVacancyService.updatePut).toBeCalledTimes(1);
      expect(mockVacancyService.updatePut).toBeCalledWith(id, Udto);
    });

    it("should update the vacancy", () => {
      const id = 1;
      const Udto: UpdateVacancyPutDto = {
        description: "New test",
        iDepartment: 1,
        requirements: "New test",
        title: "New test",
      };

      expect(controller.updatePut(id, Udto)).toEqual({ statusCode: 200, message: "Vaga alterada com sucesso" });
      expect(mockVacancyService.updatePut).toBeCalledTimes(1);
      expect(mockVacancyService.updatePut).toBeCalledWith(id, Udto);
    });
  });
});
