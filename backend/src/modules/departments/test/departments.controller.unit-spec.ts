import { Test, TestingModule } from "@nestjs/testing";

import { CreateDepartmentDto, UpdateDepartmentPatchDto, UpdateDepartmentPutDto } from "../dto";
import { DepartmentsController } from "../departments.controller";
import { DepartmentsService } from "../departments.service";

describe("Departments Controller", () => {
  let controller: DepartmentsController;

  const mockDepartmentService = {
    create: jest.fn((Cdto: CreateDepartmentDto) => {
      if (Cdto.name === "Test") {
        return {
          statusCode: 201,
          message: "Departamento criado com sucesso",
        };
      }
      if (Cdto.name === "Test 01") {
        return {
          statusCode: 400,
          message: "Departamento já existente",
        };
      }
    }),
    data: jest.fn((id: number) => {
      if (id === 1) {
        return {
          statusCode: 200,
          data: { id: 1, createdAt: new Date(), description: "Test", name: "Test", updatedAt: new Date() },
        };
      }
      if (id === 2) {
        return {
          statusCode: 404,
          message: "Departamento não encontrado",
        };
      }
    }),
    destroy: jest.fn((id: number) => {
      if (id === 1) {
        return {
          statusCode: 200,
          message: "Departamento excluído com sucesso",
        };
      }
      if (id === 2) {
        return {
          statusCode: 404,
          message: "Departamento não encontrado",
        };
      }
    }),
    list: jest.fn(() => {
      return {
        statusCode: 200,
        list: [{ id: 1, createdAt: new Date(), description: "Test", name: "Test", updatedAt: new Date() }],
      };
    }),
    updatePatch: jest.fn((id: number, Udto: UpdateDepartmentPatchDto) => {
      if ((id === 1 && Udto.name !== "Test 01") || (id === 1 && !Udto.name)) {
        return {
          statusCode: 200,
          message: "Departamento alterado com sucesso",
        };
      }
      if (id === 1 && Udto.name === "Test 01") {
        return {
          statusCode: 400,
          message: "Departamento já existente",
        };
      }
      if (id === 2) {
        return {
          statusCode: 404,
          message: "Departamento não encontrado",
        };
      }
    }),
    updatePut: jest.fn((id: number, Udto: UpdateDepartmentPutDto) => {
      if (id === 1 && Udto.name !== "Test 01") {
        return {
          statusCode: 200,
          message: "Departamento alterado com sucesso",
        };
      }
      if (id === 1 && Udto.name === "Test 01") {
        return {
          statusCode: 400,
          message: "Departamento já existente",
        };
      }
      if (id === 2) {
        return {
          statusCode: 404,
          message: "Departamento não encontrado",
        };
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentsController],
      providers: [DepartmentsService],
    })
      .overrideProvider(DepartmentsService)
      .useValue(mockDepartmentService)
      .compile();

    controller = module.get<DepartmentsController>(DepartmentsController);
  });

  describe("DELETE department", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to delete a department with invalid id", () => {
      const id = 2;

      expect(controller.destroy(id)).toEqual({ statusCode: 404, message: "Departamento não encontrado" });
      expect(mockDepartmentService.destroy).toBeCalledTimes(1);
      expect(mockDepartmentService.destroy).toBeCalledWith(id);
    });

    it("should delete department with id 1", () => {
      const id = 1;

      expect(controller.destroy(id)).toEqual({ statusCode: 200, message: "Departamento excluído com sucesso" });
      expect(mockDepartmentService.destroy).toBeCalledTimes(1);
      expect(mockDepartmentService.destroy).toBeCalledWith(id);
    });
  });

  describe("GET departments list", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should get the departments list", () => {
      expect(controller.list()).toEqual({
        statusCode: 200,
        list: [{ id: 1, createdAt: expect.any(Date), description: "Test", name: "Test", updatedAt: expect.any(Date) }],
      });
      expect(mockDepartmentService.list).toBeCalledTimes(1);
    });
  });

  describe("GET department data", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to get the department with an invalid id", () => {
      const id = 2;

      expect(controller.data(id)).toEqual({ statusCode: 404, message: "Departamento não encontrado" });
      expect(mockDepartmentService.data).toBeCalledTimes(1);
      expect(mockDepartmentService.data).toBeCalledWith(id);
    });

    it("should get the department data by id", () => {
      const id = 1;

      expect(controller.data(id)).toEqual({
        statusCode: 200,
        data: { id: 1, createdAt: expect.any(Date), description: "Test", name: "Test", updatedAt: expect.any(Date) },
      });
      expect(mockDepartmentService.data).toBeCalledTimes(1);
      expect(mockDepartmentService.data).toBeCalledWith(id);
    });
  });

  describe("PATCH department", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to update with an invalid id", () => {
      const id = 2;

      const Udto: UpdateDepartmentPatchDto = {
        description: "Test 02",
      };

      expect(controller.updatePatch(id, Udto)).toEqual({ statusCode: 404, message: "Departamento não encontrado" });
      expect(mockDepartmentService.updatePatch).toBeCalledTimes(1);
      expect(mockDepartmentService.updatePatch).toBeCalledWith(id, Udto);
    });

    it("should try to update with an already used name", () => {
      const id = 1;

      const Udto: UpdateDepartmentPatchDto = {
        name: "Test 01",
      };

      expect(controller.updatePatch(id, Udto)).toEqual({ statusCode: 400, message: "Departamento já existente" });
      expect(mockDepartmentService.updatePatch).toBeCalledTimes(1);
      expect(mockDepartmentService.updatePatch).toBeCalledWith(id, Udto);
    });

    it("should update the department", () => {
      const id = 1;

      const Udto: UpdateDepartmentPatchDto = {
        name: "Test 02",
      };

      expect(controller.updatePatch(id, Udto)).toEqual({
        statusCode: 200,
        message: "Departamento alterado com sucesso",
      });
      expect(mockDepartmentService.updatePatch).toBeCalledTimes(1);
      expect(mockDepartmentService.updatePatch).toBeCalledWith(id, Udto);
    });
  });

  describe("POST department", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to create a new department with an invalid name", () => {
      const Cdto: CreateDepartmentDto = {
        description: "Test 01",
        name: "Test 01",
      };

      expect(controller.create(Cdto)).toEqual({ statusCode: 400, message: "Departamento já existente" });
      expect(mockDepartmentService.create).toBeCalledTimes(1);
      expect(mockDepartmentService.create).toBeCalledWith(Cdto);
    });

    it("should create a new department", () => {
      const Cdto: CreateDepartmentDto = {
        description: "Test",
        name: "Test",
      };

      expect(controller.create(Cdto)).toEqual({ statusCode: 201, message: "Departamento criado com sucesso" });
      expect(mockDepartmentService.create).toBeCalledTimes(1);
      expect(mockDepartmentService.create).toBeCalledWith(Cdto);
    });
  });

  describe("PUT department", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to update with an invalid id", () => {
      const id = 2;

      const Udto: UpdateDepartmentPutDto = {
        description: "Test 02",
        name: "Test 02",
      };

      expect(controller.updatePut(id, Udto)).toEqual({ statusCode: 404, message: "Departamento não encontrado" });
      expect(mockDepartmentService.updatePut).toBeCalledTimes(1);
      expect(mockDepartmentService.updatePut).toBeCalledWith(id, Udto);
    });

    it("should try to update with an already used name", () => {
      const id = 1;

      const Udto: UpdateDepartmentPutDto = {
        description: "Test 01",
        name: "Test 01",
      };

      expect(controller.updatePut(id, Udto)).toEqual({ statusCode: 400, message: "Departamento já existente" });
      expect(mockDepartmentService.updatePut).toBeCalledTimes(1);
      expect(mockDepartmentService.updatePut).toBeCalledWith(id, Udto);
    });

    it("should update the department", () => {
      const id = 1;

      const Udto: UpdateDepartmentPutDto = {
        description: "Test 02",
        name: "Test 02",
      };

      expect(controller.updatePut(id, Udto)).toEqual({
        statusCode: 200,
        message: "Departamento alterado com sucesso",
      });
      expect(mockDepartmentService.updatePut).toBeCalledTimes(1);
      expect(mockDepartmentService.updatePut).toBeCalledWith(id, Udto);
    });
  });
});
