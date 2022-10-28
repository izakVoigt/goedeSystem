import { NotFoundException } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import { Departments } from "../../departments/model/departments.model";
import { DepartmentsModule } from "../../departments/departments.module";
import { DepartmentsService } from "../../departments/departments.service";
import { Vacancies } from "../model/vacancies.model";
import { VacanciesController } from "../vacancies.controller";
import { VacanciesModule } from "../vacancies.module";
import { VacanciesService } from "../vacancies.service";
import { CreateVacancyDto, UpdateVacancyPatchDto, UpdateVacancyPutDto } from "../dto";
import { databaseOptions } from "../../../config/database.config";

describe("Vacancies module", () => {
  let controller: VacanciesController;
  let departmentsService: DepartmentsService;
  let sequelize: Sequelize;
  let vacanciesService: VacanciesService;

  const createDepartment = async () => {
    await departmentsService.create({ description: "Test", name: "Test" });
  };
  const createVacancy01 = async () => {
    await vacanciesService.create({
      description: "Test 01",
      iDepartment: 1,
      requirements: "Test 01",
      title: "Test 01",
    });
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DepartmentsModule,
        VacanciesModule,
        SequelizeModule.forRoot(databaseOptions),
        SequelizeModule.forFeature([Departments, Vacancies]),
      ],
    }).compile();

    controller = module.get<VacanciesController>(VacanciesController);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    sequelize = module.get<Sequelize>(Sequelize);
    vacanciesService = module.get<VacanciesService>(VacanciesService);

    await createDepartment();
  });
  afterAll(async () => {
    await sequelize.dropAllSchemas({ logging: false });
    await sequelize.sync();
  });

  describe("Create vacancy", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should create a new vacancy", async () => {
      const Cdto: CreateVacancyDto = {
        description: "Test",
        iDepartment: 1,
        requirements: "Test",
        title: "Test",
      };

      await createDepartment();

      const req = await controller.create(Cdto);
      const validation = await vacanciesService.data(1);

      expect(req.message).toEqual("Vaga criada com sucesso");
      expect(validation.data.id).toEqual(1);
      expect(validation.data.description).toEqual("Test");
      expect(validation.data.iDepartment).toEqual(1);
      expect(validation.data.requirements).toEqual("Test");
      expect(validation.data.title).toEqual("Test");
    });

    it("should try a new vacancy with an invalid department id", async () => {
      const Cdto: CreateVacancyDto = {
        description: "Test",
        iDepartment: 2,
        requirements: "Test",
        title: "Test",
      };

      const validation = await vacanciesService.list();

      await expect(controller.create(Cdto)).rejects.toThrow(new NotFoundException("Departamento não encontrado"));
      expect(validation.list.length).toEqual(0);
    });
  });

  describe("Data vacancy", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should get vacancy data", async () => {
      const id = 1;

      await createDepartment();
      await createVacancy01();

      const req = await controller.data(id);

      expect(req.data.id).toEqual(1);
      expect(req.data.description).toEqual("Test 01");
      expect(req.data.iDepartment).toEqual(1);
      expect(req.data.requirements).toEqual("Test 01");
      expect(req.data.title).toEqual("Test 01");
    });

    it("should try to get a vacancy data with an invalid id", async () => {
      const id = 2;

      await expect(controller.data(id)).rejects.toThrow(new NotFoundException("Vaga não encontrada"));
    });
  });

  describe("Destroy vacancy", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should destroy a vacancy", async () => {
      const id = 1;

      await createDepartment();
      await createVacancy01();

      const req = await controller.destroy(id);
      const validation = await vacanciesService.list();

      expect(req.message).toEqual("Vaga excluída com sucesso");
      expect(validation.list.length).toEqual(0);
    });

    it("should destroy a vacancy", async () => {
      const id = 1;

      await createDepartment();

      const validation = await vacanciesService.list();

      await expect(controller.destroy(id)).rejects.toThrow(new NotFoundException("Vaga não encontrada"));
      expect(validation.list.length).toEqual(0);
    });
  });

  describe("List vacancies", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should list all vacancies", async () => {
      await createDepartment();
      await createVacancy01();

      const req = await controller.list();

      expect(req.list.length).toEqual(1);
    });
  });

  describe("Update Patch vacancy", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should update vacancy id 1", async () => {
      const id = 1;
      const Udto: UpdateVacancyPatchDto = {
        description: "Test 03",
      };

      await createDepartment();
      await createVacancy01();

      const req = await controller.updatePatch(id, Udto);
      const validation = await vacanciesService.data(1);

      expect(req.message).toEqual("Vaga alterada com sucesso");
      expect(validation.data.description).toEqual("Test 03");
    });

    it("should try to update vacancy id 1 with an invalid department id", async () => {
      const id = 1;
      const Udto: UpdateVacancyPatchDto = {
        iDepartment: 2,
      };

      await createDepartment();
      await createVacancy01();

      const validation = await vacanciesService.data(1);

      await expect(controller.updatePatch(id, Udto)).rejects.toThrow(
        new NotFoundException("Departamento não encontrado"),
      );
      expect(validation.data.iDepartment).toEqual(1);
    });

    it("should try to update vacancy with an invalid id", async () => {
      const id = 2;
      const Udto: UpdateVacancyPatchDto = {
        description: "Test 03",
      };

      await createDepartment();
      await createVacancy01();

      await expect(controller.updatePatch(id, Udto)).rejects.toThrow(new NotFoundException("Vaga não encontrada"));
    });
  });

  describe("Update Put vacancy", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should update vacancy id 1", async () => {
      const id = 1;
      const Udto: UpdateVacancyPutDto = {
        description: "Test 03",
        iDepartment: 1,
        requirements: "Test 03",
        title: "Test 03",
      };

      await createDepartment();
      await createVacancy01();

      const req = await controller.updatePut(id, Udto);
      const validation = await vacanciesService.data(1);

      expect(req.message).toEqual("Vaga alterada com sucesso");
      expect(validation.data.description).toEqual("Test 03");
      expect(validation.data.iDepartment).toEqual(1);
      expect(validation.data.requirements).toEqual("Test 03");
      expect(validation.data.title).toEqual("Test 03");
    });

    it("should try update vacancy id 1 with an invalid department", async () => {
      const id = 1;
      const Udto: UpdateVacancyPutDto = {
        description: "Test 03",
        iDepartment: 2,
        requirements: "Test 03",
        title: "Test 03",
      };

      await createDepartment();
      await createVacancy01();

      const validation = await vacanciesService.data(1);

      await expect(controller.updatePut(id, Udto)).rejects.toThrow(
        new NotFoundException("Departamento não encontrado"),
      );
      expect(validation.data.description).toEqual("Test 01");
      expect(validation.data.iDepartment).toEqual(1);
      expect(validation.data.requirements).toEqual("Test 01");
      expect(validation.data.title).toEqual("Test 01");
    });

    it("should try update vacancy id 1 with an invalid department", async () => {
      const id = 2;
      const Udto: UpdateVacancyPutDto = {
        description: "Test 03",
        iDepartment: 1,
        requirements: "Test 03",
        title: "Test 03",
      };

      await createDepartment();
      await createVacancy01();

      const validation = await vacanciesService.data(1);

      await expect(controller.updatePut(id, Udto)).rejects.toThrow(new NotFoundException("Vaga não encontrada"));
      expect(validation.data.description).toEqual("Test 01");
      expect(validation.data.iDepartment).toEqual(1);
      expect(validation.data.requirements).toEqual("Test 01");
      expect(validation.data.title).toEqual("Test 01");
    });
  });
});
