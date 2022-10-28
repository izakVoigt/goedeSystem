import { BadRequestException, NotFoundException } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";

import { Departments } from "../model/departments.model";
import { DepartmentsController } from "../departments.controller";
import { DepartmentsModule } from "../departments.module";
import { DepartmentsService } from "../departments.service";
import { CreateDepartmentDto, UpdateDepartmentPatchDto, UpdateDepartmentPutDto } from "../dto";
import { databaseOptions } from "../../../config/database.config";

describe("Department module", () => {
  let controller: DepartmentsController;
  let sequelize: Sequelize;
  let service: DepartmentsService;

  const createDepartment01 = async () => {
    await service.create({
      description: "Test 01",
      name: "Test 01",
    });
  };
  const createDepartment02 = async () => {
    await service.create({
      description: "Test 02",
      name: "Test 02",
    });
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DepartmentsModule, SequelizeModule.forRoot(databaseOptions), SequelizeModule.forFeature([Departments])],
    }).compile();

    controller = module.get<DepartmentsController>(DepartmentsController);
    sequelize = module.get<Sequelize>(Sequelize);
    service = module.get<DepartmentsService>(DepartmentsService);
  });
  afterAll(async () => {
    await sequelize.dropAllSchemas({ logging: false });
    await sequelize.sync();
  });

  describe("Create department", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should create a new department", async () => {
      const Cdto: CreateDepartmentDto = {
        description: "Test 01",
        name: "Test 01",
      };

      const req = await controller.create(Cdto);
      const validation = await service.list();

      expect(req.message).toEqual("Departamento criado com sucesso");
      expect(validation.list[0].id).toEqual(1);
      expect(validation.list[0].createdAt).toEqual(expect.any(Date));
      expect(validation.list[0].description).toEqual("Test 01");
      expect(validation.list[0].name).toEqual("Test 01");
      expect(validation.list[0].updatedAt).toEqual(expect.any(Date));
    });

    it("should try to create a new department with an invalid name", async () => {
      await createDepartment01();

      const Cdto: CreateDepartmentDto = {
        description: "Test 01",
        name: "Test 01",
      };

      const validation = await service.list();

      await expect(controller.create(Cdto)).rejects.toThrow(new BadRequestException("Departamento já existente"));
      expect(validation.list[0].id).toEqual(1);
      expect(validation.list[0].createdAt).toEqual(expect.any(Date));
      expect(validation.list[0].description).toEqual("Test 01");
      expect(validation.list[0].name).toEqual("Test 01");
      expect(validation.list[0].updatedAt).toEqual(expect.any(Date));
    });
  });

  describe("Data department", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should get department's id 1 data", async () => {
      await createDepartment01();

      const req = await controller.data(1);

      expect(req.data.id).toEqual(1);
      expect(req.data.createdAt).toEqual(expect.any(Date));
      expect(req.data.description).toEqual("Test 01");
      expect(req.data.name).toEqual("Test 01");
      expect(req.data.updatedAt).toEqual(expect.any(Date));
    });

    it("should try to get department's data from an invalid id", async () => {
      const validation = await service.list();

      await expect(controller.data(1)).rejects.toThrow(new NotFoundException("Departamento não encontrado"));
      expect(validation.list.length).toEqual(0);
    });
  });

  describe("Destroy department", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should destroy department with id 1", async () => {
      await createDepartment01();

      const req = await controller.destroy(1);

      const validation = await service.list();

      expect(req.message).toEqual("Departamento excluído com sucesso");
      expect(validation.list.length).toEqual(0);
    });

    it("should try to destroy department with id 1 and fail", async () => {
      await createDepartment01();

      const validation = await service.list();

      await expect(controller.destroy(2)).rejects.toThrow(new NotFoundException("Departamento não encontrado"));
      expect(validation.list.length).toEqual(1);
    });
  });

  describe("List departments", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should list all departments", async () => {
      await createDepartment01();

      const req = await controller.list();

      expect(req.list.length).toEqual(1);
    });
  });

  describe("Update Patch department", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should update department with id 1", async () => {
      await createDepartment01();

      const Udto: UpdateDepartmentPatchDto = {
        name: "Test 02",
      };

      const req = await controller.updatePatch(1, Udto);

      const validation = await service.data(1);

      expect(req.message).toEqual("Departamento alterado com sucesso");
      expect(validation.data.description).toEqual("Test 01");
      expect(validation.data.name).toEqual("Test 02");
    });

    it("should try to update a department nonexistent", async () => {
      const Udto: UpdateDepartmentPatchDto = {
        name: "Test 02",
      };

      const validation = await service.list();

      await expect(controller.updatePatch(1, Udto)).rejects.toThrow(
        new NotFoundException("Departamento não encontrado"),
      );
      expect(validation.list.length).toEqual(0);
    });

    it("should try to update a department with an invalid name", async () => {
      await createDepartment01();
      await createDepartment02();

      const Udto: UpdateDepartmentPatchDto = {
        name: "Test 01",
      };

      const validation = await service.data(2);

      await expect(controller.updatePatch(1, Udto)).rejects.toThrow(
        new BadRequestException("Departamento já existente"),
      );
      expect(validation.data.name).toEqual("Test 02");
    });
  });

  describe("Update Put department", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should update department with id 1", async () => {
      await createDepartment01();

      const Udto: UpdateDepartmentPutDto = {
        description: "Test 02",
        name: "Test 02",
      };

      const req = await controller.updatePut(1, Udto);

      const validation = await service.data(1);

      expect(req.message).toEqual("Departamento alterado com sucesso");
      expect(validation.data.description).toEqual("Test 02");
      expect(validation.data.name).toEqual("Test 02");
    });

    it("should try to update a department nonexistent", async () => {
      const Udto: UpdateDepartmentPutDto = {
        description: "Test 02",
        name: "Test 02",
      };

      const validation = await service.list();

      await expect(controller.updatePut(1, Udto)).rejects.toThrow(new NotFoundException("Departamento não encontrado"));
      expect(validation.list.length).toEqual(0);
    });

    it("should try to update a department with an invalid name", async () => {
      await createDepartment01();
      await createDepartment02();

      const Udto: UpdateDepartmentPutDto = {
        description: "Test 02",
        name: "Test 02",
      };

      const validation = await service.data(2);

      await expect(controller.updatePut(1, Udto)).rejects.toThrow(new BadRequestException("Departamento já existente"));
      expect(validation.data.name).toEqual("Test 02");
    });
  });
});
