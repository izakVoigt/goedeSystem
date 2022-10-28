import { BadRequestException, NotFoundException } from "@nestjs/common";
import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { DestroyOptions, FindOptions, UpdateOptions } from "sequelize";

import { DepartmentsService } from "../departments.service";
import { Departments } from "../model/departments.model";
import { IDepartmentsModel } from "../model/departments.type.model";

describe("Departments Service", () => {
  let service: DepartmentsService;

  const departmentsTable: IDepartmentsModel[] = [];

  const mockSequelizeDepartments = {
    create: jest.fn((description: string, name: string) => {
      departmentsTable.push({
        id: departmentsTable.length + 1,
        createdAt: new Date(),
        description,
        name,
        updatedAt: new Date(),
      });

      return departmentsTable.slice(-1);
    }),
    destroy: jest.fn((options?: DestroyOptions<IDepartmentsModel>) => {
      // @ts-ignore
      const id: number = options.where.id;

      const itemIndex = departmentsTable.findIndex((item) => item.id === id);

      departmentsTable.splice(itemIndex, 1);
    }),
    findAll: jest.fn(() => {
      return departmentsTable;
    }),
    findByPk: jest.fn((id: number) => {
      const department = departmentsTable.find((item) => item.id === id);

      return department;
    }),
    findOne: jest.fn((options: FindOptions<IDepartmentsModel>) => {
      // @ts-ignore
      const name: string = options.where.name;

      const department = departmentsTable.find((item) => item.name === name);

      return department;
    }),
    update: jest.fn(
      (
        values: {
          id?: number;
          createdAt?: Date;
          deletedAt?: Date;
          description?: string;
          name?: string;
          updatedAt?: Date;
        },
        options?: UpdateOptions<IDepartmentsModel>,
      ) => {
        // @ts-ignore
        const id: number = options.where.id;

        const data = departmentsTable.findIndex((item) => item.id === id);

        if (values.description) {
          departmentsTable[data].description = values.description;
          departmentsTable[data].updatedAt = new Date();
        }
        if (values.name) {
          departmentsTable[data].name = values.name;
          departmentsTable[data].updatedAt = new Date();
        }
      },
    ),
  };

  const createDepartment = () => {
    departmentsTable.push({
      id: departmentsTable.length + 1,
      createdAt: new Date(),
      description: "Test",
      name: "Test",
      updatedAt: new Date(),
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartmentsService, { provide: getModelToken(Departments), useValue: mockSequelizeDepartments }],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
  });
  afterAll(() => {
    departmentsTable.length = 0;
  });

  describe("Create department", () => {
    afterAll(() => {
      departmentsTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should create a new department", async () => {
      const req = await service.create({ description: "Test", name: "Test" });

      expect(req.message).toEqual("Departamento criado com sucesso");
      expect(mockSequelizeDepartments.findOne).toBeCalledTimes(1);
      expect(mockSequelizeDepartments.create).toBeCalledTimes(1);
    });

    it("should try to create a new department with the same name", async () => {
      createDepartment();

      await expect(service.create({ description: "Test", name: "Test" })).rejects.toThrow(
        new BadRequestException("Departamento já existente"),
      );
      expect(mockSequelizeDepartments.findOne).toBeCalledTimes(1);
      expect(mockSequelizeDepartments.create).toBeCalledTimes(0);
    });
  });

  describe("Data department", () => {
    beforeAll(() => {
      createDepartment();
    });
    afterAll(() => {
      departmentsTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should get department data", async () => {
      const req = await service.data(1);

      expect(req.data).toEqual({
        id: 1,
        createdAt: expect.any(Date),
        description: "Test",
        name: "Test",
        updatedAt: expect.any(Date),
      });
      expect(mockSequelizeDepartments.findByPk).toBeCalledTimes(1);
    });

    it("should try to get department data from a invalid id", async () => {
      await expect(service.data(2)).rejects.toThrow(new NotFoundException("Departamento não encontrado"));
      expect(mockSequelizeDepartments.findByPk).toBeCalledTimes(1);
    });
  });

  describe("Destroy department", () => {
    beforeAll(() => {
      createDepartment();
    });
    afterAll(() => {
      departmentsTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should destroy vacancy with id 1", async () => {
      const req = await service.destroy(1);

      expect(req.message).toEqual("Departamento excluído com sucesso");
      expect(mockSequelizeDepartments.findByPk).toBeCalledTimes(1);
      expect(mockSequelizeDepartments.destroy).toBeCalledTimes(1);
      expect(departmentsTable.length).toEqual(0);
    });

    it("should try to destroy a vacancy with an invalid id", async () => {
      await expect(service.destroy(2)).rejects.toThrow(new NotFoundException("Departamento não encontrado"));
      expect(mockSequelizeDepartments.findByPk).toBeCalledTimes(1);
      expect(mockSequelizeDepartments.destroy).toBeCalledTimes(0);
    });
  });

  describe("List departments", () => {
    beforeAll(() => {
      createDepartment();
    });
    afterAll(() => {
      departmentsTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should list all departments", async () => {
      const req = await service.list();

      expect(req.list).toHaveLength(1);
      expect(mockSequelizeDepartments.findAll).toBeCalledTimes(1);
    });

    it("should try to list all departments with an empty table", async () => {
      departmentsTable.length = 0;

      const req = await service.list();

      expect(req.list).toHaveLength(0);
      expect(mockSequelizeDepartments.findAll).toBeCalledTimes(1);
    });
  });

  describe("UpdatePatch department", () => {
    beforeAll(() => {
      createDepartment();
    });
    afterAll(() => {
      departmentsTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to update with an invalid name", async () => {
      departmentsTable.push({
        id: departmentsTable.length + 1,
        createdAt: new Date(),
        description: "Test 01",
        name: "Test 01",
        updatedAt: new Date(),
      });

      await expect(service.updatePatch(1, { name: "Test 01" })).rejects.toThrow(
        new BadRequestException("Departamento já existente"),
      );
      expect(mockSequelizeDepartments.findOne).toBeCalledTimes(1);
      expect(mockSequelizeDepartments.update).toBeCalledTimes(0);
      expect(departmentsTable[0].description).toEqual("Test");
      expect(departmentsTable[0].name).toEqual("Test");
    });

    it("should try to update with an invalid id", async () => {
      await expect(service.updatePatch(3, { description: "Test 03" })).rejects.toThrow(
        new NotFoundException("Departamento não encontrado"),
      );
      expect(mockSequelizeDepartments.findByPk).toBeCalledTimes(1);
      expect(mockSequelizeDepartments.update).toBeCalledTimes(0);
      expect(departmentsTable[0].description).toEqual("Test");
      expect(departmentsTable[0].name).toEqual("Test");
    });

    it("should update department with id 1", async () => {
      const req = await service.updatePatch(1, { description: "Test 02", name: "Test 02" });

      expect(req.message).toEqual("Departamento alterado com sucesso");
      expect(mockSequelizeDepartments.findByPk).toBeCalledTimes(1);
      expect(mockSequelizeDepartments.update).toBeCalledTimes(1);
      expect(departmentsTable[0].description).toEqual("Test 02");
      expect(departmentsTable[0].name).toEqual("Test 02");
    });
  });

  describe("UpdatePut department", () => {
    beforeAll(() => {
      createDepartment();
    });
    afterAll(() => {
      departmentsTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should update department with id 1", async () => {
      const req = await service.updatePut(1, { description: "Test 01", name: "Test 01" });

      expect(req.message).toEqual("Departamento alterado com sucesso");
      expect(mockSequelizeDepartments.update).toBeCalledTimes(1);
      expect(departmentsTable[0].description).toEqual("Test 01");
      expect(departmentsTable[0].name).toEqual("Test 01");
    });

    it("should try to update with an invalid name", async () => {
      departmentsTable.push({
        id: departmentsTable.length + 1,
        createdAt: new Date(),
        description: "Test 02",
        name: "Test 02",
        updatedAt: new Date(),
      });

      await expect(service.updatePut(1, { description: "Test 02", name: "Test 02" })).rejects.toThrow(
        new BadRequestException("Departamento já existente"),
      );
      expect(mockSequelizeDepartments.findOne).toBeCalledTimes(1);
      expect(mockSequelizeDepartments.update).toBeCalledTimes(0);
      expect(departmentsTable[0].description).toEqual("Test 01");
      expect(departmentsTable[0].name).toEqual("Test 01");
    });

    it("should try to update with an invalid id", async () => {
      await expect(service.updatePut(3, { description: "Test 03", name: "Test 03" })).rejects.toThrow(
        new NotFoundException("Departamento não encontrado"),
      );
      expect(mockSequelizeDepartments.findByPk).toBeCalledTimes(1);
      expect(mockSequelizeDepartments.update).toBeCalledTimes(0);
    });
  });
});
