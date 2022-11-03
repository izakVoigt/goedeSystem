import { NotFoundException } from "@nestjs/common";
import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { DestroyOptions, UpdateOptions } from "sequelize";
import { VacanciesService } from "../vacancies.service";
import { DepartmentsService } from "../../departments/departments.service";
import { Departments } from "../../departments/model/departments.model";
import { IDepartmentsModel } from "../../departments/model/departments.type.model";
import { Vacancies } from "../model/vacancies.model";
import { IVacanciesModel } from "../model/vacancies.type.model";

describe("Vacancies Service", () => {
  let service: VacanciesService;

  const vacanciesTable: IVacanciesModel[] = [];

  const departmentsTable: IDepartmentsModel[] = [];

  const mockSequelizeDepartments = {
    findByPk: jest.fn((id: number) => {
      const department = departmentsTable.find((item) => item.id === id);

      return department;
    }),
  };

  const mockSequelizeVacancies = {
    create: jest.fn((description: string, iDepartment: number, requirements: string, title: string) => {
      vacanciesTable.push({
        id: vacanciesTable.length + 1,
        createdAt: new Date(),
        description,
        iDepartment,
        requirements,
        title,
        updatedAt: new Date(),
      });

      return vacanciesTable.slice(-1);
    }),
    destroy: jest.fn((options?: DestroyOptions<IVacanciesModel>) => {
      // @ts-ignore
      const id: number = options.where.id;

      const itemIndex = vacanciesTable.findIndex((item) => item.id === id);

      vacanciesTable.splice(itemIndex, 1);
    }),
    findAll: jest.fn(() => {
      return vacanciesTable;
    }),
    findByPk: jest.fn((id: number) => {
      const vacancy = vacanciesTable.find((item) => item.id === id);

      return vacancy;
    }),
    update: jest.fn(
      (
        values: {
          id?: number;
          createdAt?: Date;
          deletedAt?: Date;
          description?: string;
          iDepartment?: number;
          requirements?: string;
          title?: string;
          updatedAt?: Date;
        },
        options?: UpdateOptions<IVacanciesModel>,
      ) => {
        // @ts-ignore
        const id: number = options.where.id;

        const data = vacanciesTable.findIndex((item) => item.id === id);

        if (values.description) {
          vacanciesTable[data].description = values.description;
          vacanciesTable[data].updatedAt = new Date();
        }
        if (values.iDepartment) {
          vacanciesTable[data].iDepartment = values.iDepartment;
          vacanciesTable[data].updatedAt = new Date();
        }
        if (values.requirements) {
          vacanciesTable[data].requirements = values.requirements;
          vacanciesTable[data].updatedAt = new Date();
        }
        if (values.title) {
          vacanciesTable[data].title = values.title;
          vacanciesTable[data].updatedAt = new Date();
        }
      },
    ),
  };

  const createVacancy = () => {
    vacanciesTable.push({
      id: vacanciesTable.length + 1,
      createdAt: new Date(),
      description: "Test",
      iDepartment: 1,
      requirements: "Test",
      title: "Test",
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacanciesService,
        { provide: getModelToken(Vacancies), useValue: mockSequelizeVacancies },
        DepartmentsService,
        { provide: getModelToken(Departments), useValue: mockSequelizeDepartments },
      ],
    }).compile();

    service = module.get<VacanciesService>(VacanciesService);
  });
  afterAll(() => {
    vacanciesTable.length = 0;
    departmentsTable.length = 0;
  });

  describe("Create vacancy", () => {
    afterAll(() => {
      vacanciesTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should create a new vacancy", async () => {
      const req = await service.create({ description: "Test", iDepartment: 1, requirements: "Test", title: "Test" });

      expect(req.message).toEqual("Vaga criada com sucesso");
      expect(mockSequelizeDepartments.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeVacancies.create).toHaveBeenCalledTimes(1);
    });

    it("should try to create a new vacancy with an invalid department id", async () => {
      await expect(
        service.create({ description: "Test", iDepartment: 2, requirements: "Test", title: "Test" }),
      ).rejects.toThrow(new NotFoundException("Departamento não encontrado"));
      expect(mockSequelizeDepartments.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeVacancies.create).toHaveBeenCalledTimes(0);
    });
  });

  describe("Data vacancy", () => {
    beforeAll(() => {
      createVacancy();
    });
    afterAll(() => {
      vacanciesTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should get vacancy data", async () => {
      const req = await service.data(1);

      expect(req).toEqual({
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
      expect(mockSequelizeVacancies.findByPk).toHaveBeenCalledTimes(1);
    });

    it("should try to get vacancy data from a invalid id", async () => {
      await expect(service.data(2)).rejects.toThrow(new NotFoundException("Vaga não encontrada"));
      expect(mockSequelizeVacancies.findByPk).toHaveBeenCalledTimes(1);
    });
  });

  describe("Destroy vacancy", () => {
    beforeAll(() => {
      createVacancy();
    });
    afterAll(() => {
      vacanciesTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should destroy vacancy with id 1", async () => {
      const req = await service.destroy(1);

      expect(req.message).toEqual("Vaga excluída com sucesso");
      expect(mockSequelizeVacancies.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeVacancies.destroy).toHaveBeenCalledTimes(1);
      expect(vacanciesTable.length).toEqual(0);
    });

    it("should try to destroy a vacancy with an invalid id", async () => {
      await expect(service.destroy(2)).rejects.toThrow(new NotFoundException("Vaga não encontrada"));
      expect(mockSequelizeVacancies.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeVacancies.destroy).toHaveBeenCalledTimes(0);
    });
  });

  describe("List vacancies", () => {
    beforeAll(() => {
      createVacancy();
    });
    afterAll(() => {
      vacanciesTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should list all vacancies", async () => {
      const req = await service.list();

      expect(req.list).toEqual([
        {
          id: 1,
          createdAt: expect.any(Date),
          description: "Test",
          iDepartment: 1,
          requirements: "Test",
          title: "Test",
          updatedAt: expect.any(Date),
        },
      ]);
      expect(req.list).toHaveLength(1);
      expect(mockSequelizeVacancies.findAll).toHaveBeenCalledTimes(1);
    });

    it("should try to list all vacancies with an empty table", async () => {
      vacanciesTable.length = 0;

      const req = await service.list();

      expect(req.list).toHaveLength(0);
      expect(mockSequelizeVacancies.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("UpdatePatch vacancy", () => {
    beforeAll(() => {
      createVacancy();
    });
    afterAll(() => {
      vacanciesTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should update vacancy with id 1", async () => {
      const req = await service.updatePatch(1, { description: "Test 02", iDepartment: 1, title: "Test 02" });

      expect(req.message).toEqual("Vaga alterada com sucesso");
      expect(mockSequelizeVacancies.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeVacancies.update).toHaveBeenCalledTimes(1);
      expect(vacanciesTable[0].description).toEqual("Test 02");
      expect(vacanciesTable[0].title).toEqual("Test 02");
    });

    it("should try to update with an invalid department", async () => {
      await expect(service.updatePatch(1, { description: "Test 03", iDepartment: 2 })).rejects.toThrow(
        new NotFoundException("Departamento não encontrado"),
      );
      expect(mockSequelizeVacancies.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeDepartments.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeVacancies.update).toHaveBeenCalledTimes(0);
      expect(vacanciesTable[0].description).toEqual("Test 02");
      expect(vacanciesTable[0].iDepartment).toEqual(1);
    });

    it("should try to update with an invalid id", async () => {
      await expect(service.updatePatch(2, { description: "Test 03", title: "Test 03" })).rejects.toThrow(
        new NotFoundException("Vaga não encontrada"),
      );
      expect(mockSequelizeVacancies.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeDepartments.findByPk).toHaveBeenCalledTimes(0);
      expect(mockSequelizeVacancies.update).toHaveBeenCalledTimes(0);
      expect(vacanciesTable[0].description).toEqual("Test 02");
      expect(vacanciesTable[0].title).toEqual("Test 02");
    });
  });

  describe("UpdatePut vacancy", () => {
    beforeAll(() => {
      createVacancy();
    });
    afterAll(() => {
      vacanciesTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should update vacancy with id 1", async () => {
      const req = await service.updatePut(1, {
        description: "Test 02",
        iDepartment: 1,
        requirements: "Test 02",
        title: "Test 02",
      });

      expect(req.message).toEqual("Vaga alterada com sucesso");
      expect(mockSequelizeVacancies.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeDepartments.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeVacancies.update).toHaveBeenCalledTimes(1);
      expect(vacanciesTable[0].description).toEqual("Test 02");
      expect(vacanciesTable[0].iDepartment).toEqual(1);
      expect(vacanciesTable[0].requirements).toEqual("Test 02");
      expect(vacanciesTable[0].title).toEqual("Test 02");
    });

    it("should try to update with an invalid department", async () => {
      await expect(
        service.updatePut(1, { description: "Test 03", iDepartment: 2, requirements: "Test 03", title: "Test 03" }),
      ).rejects.toThrow(new NotFoundException("Departamento não encontrado"));
      expect(mockSequelizeVacancies.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeDepartments.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeVacancies.update).toHaveBeenCalledTimes(0);
      expect(vacanciesTable[0].description).toEqual("Test 02");
      expect(vacanciesTable[0].iDepartment).toEqual(1);
      expect(vacanciesTable[0].requirements).toEqual("Test 02");
      expect(vacanciesTable[0].title).toEqual("Test 02");
    });

    it("should try to update with an invalid id", async () => {
      await expect(
        service.updatePut(2, { description: "Test 03", iDepartment: 1, requirements: "Test 03", title: "Test 03" }),
      ).rejects.toThrow(new NotFoundException("Vaga não encontrada"));
    });
  });
});
