import { BadRequestException, NotFoundException } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import { Departments } from "../../departments/model/departments.model";
import { DepartmentsModule } from "../../departments/departments.module";
import { DepartmentsService } from "../../departments/departments.service";
import { Users } from "../model/users.model";
import { UsersController } from "../users.controller";
import { UsersModule } from "../users.module";
import { UsersService } from "../users.service";
import { CreateUserDto, UpdateUserPatchDto, UpdateUserPutDto } from "../dto";
import { databaseOptions } from "../../../config/database.config";
import { brazilianStates } from "../../../util/enum/brazilianStates.enum";

describe("Users module", () => {
  let controller: UsersController;
  let departmentsService: DepartmentsService;
  let sequelize: Sequelize;
  let usersService: UsersService;

  const createDepartment = async () => {
    await departmentsService.create({ description: "Test", name: "Test" });
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
  const createUser02 = async () => {
    await usersService.create({
      address: "Test 02",
      addressCity: "Test 02",
      addressDistrict: "Test 02",
      addressNumber: 123,
      addressState: brazilianStates.SC,
      addressZipCode: "00000-000",
      birthDate: "01-01-2000",
      cpf: "222.222.222-22",
      email: "test02@test.com",
      hireDate: "01-01-2000",
      iDepartment: 1,
      name: "Test 02",
      office: "Test 02",
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

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DepartmentsModule,
        UsersModule,
        SequelizeModule.forRoot(databaseOptions),
        SequelizeModule.forFeature([Departments, Users]),
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    sequelize = module.get<Sequelize>(Sequelize);
    usersService = module.get<UsersService>(UsersService);

    await createDepartment();
  });
  afterAll(async () => {
    await sequelize.dropAllSchemas({ logging: false });
    await sequelize.sync();
  });

  describe("Create user", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should create a new user", async () => {
      const Cdto: CreateUserDto = {
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
      };

      await createDepartment();

      const req = await controller.create(Cdto);
      const validation = await usersService.data(1);

      expect(req.message).toEqual("Usuário criado com sucesso");
      expect(validation.data.id).toEqual(1);
      expect(validation.data.address).toEqual("Test 01");
      expect(validation.data.addressCity).toEqual("Test 01");
      expect(validation.data.addressDistrict).toEqual("Test 01");
      expect(validation.data.addressNumber).toEqual(123);
      expect(validation.data.addressState).toEqual(brazilianStates.SC);
      expect(validation.data.addressZipCode).toEqual("00000-000");
      expect(validation.data.birthDate).toEqual(new Date("01-01-2000"));
      expect(validation.data.cpf).toEqual("111.111.111-11");
      expect(validation.data.createdAt).toEqual(expect.any(Date));
      expect(validation.data.email).toEqual("test01@test.com");
      expect(validation.data.hireDate).toEqual(new Date("01-01-2000"));
      expect(validation.data.iDepartment).toEqual(1);
      expect(validation.data.name).toEqual("Test 01");
      expect(validation.data.office).toEqual("Test 01");
      expect(validation.data.permAccounting).toEqual(true);
      expect(validation.data.permAdmin).toEqual(true);
      expect(validation.data.permCorporate).toEqual(true);
      expect(validation.data.permFinances).toEqual(true);
      expect(validation.data.permHuman).toEqual(true);
      expect(validation.data.permMarketing).toEqual(true);
      expect(validation.data.permOversee).toEqual(true);
      expect(validation.data.phone).toEqual("(00)00000-0000");
      expect(validation.data.updatedAt).toEqual(expect.any(Date));
    });

    it("should try to create a new user with an invalid email", async () => {
      const Cdto: CreateUserDto = {
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
      };

      await createDepartment();
      await createUser01();

      const validation = await usersService.list();

      await expect(controller.create(Cdto)).rejects.toThrow(new BadRequestException("E-mail já em uso"));
      expect(validation.list.length).toEqual(1);
    });

    it("should try to create a new user with an invalid department", async () => {
      const Cdto: CreateUserDto = {
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
      };

      const validation = await usersService.list();

      await expect(controller.create(Cdto)).rejects.toThrow(new NotFoundException("Departamento não encontrado"));
      expect(validation.list.length).toEqual(0);
    });
  });

  describe("Data user", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should get data from user id 1", async () => {
      await createDepartment();
      await createUser01();

      const req = await controller.data(1);

      expect(req.data.id).toEqual(1);
      expect(req.data.address).toEqual("Test 01");
      expect(req.data.addressCity).toEqual("Test 01");
      expect(req.data.addressDistrict).toEqual("Test 01");
      expect(req.data.addressNumber).toEqual(123);
      expect(req.data.addressState).toEqual(brazilianStates.SC);
      expect(req.data.addressZipCode).toEqual("00000-000");
      expect(req.data.birthDate).toEqual(new Date("01-01-2000"));
      expect(req.data.cpf).toEqual("111.111.111-11");
      expect(req.data.createdAt).toEqual(expect.any(Date));
      expect(req.data.email).toEqual("test01@test.com");
      expect(req.data.hireDate).toEqual(new Date("01-01-2000"));
      expect(req.data.iDepartment).toEqual(1);
      expect(req.data.name).toEqual("Test 01");
      expect(req.data.office).toEqual("Test 01");
      expect(req.data.permAccounting).toEqual(true);
      expect(req.data.permAdmin).toEqual(true);
      expect(req.data.permCorporate).toEqual(true);
      expect(req.data.permFinances).toEqual(true);
      expect(req.data.permHuman).toEqual(true);
      expect(req.data.permMarketing).toEqual(true);
      expect(req.data.permOversee).toEqual(true);
      expect(req.data.phone).toEqual("(00)00000-0000");
      expect(req.data.updatedAt).toEqual(expect.any(Date));
    });

    it("should try to get data from an invalid user", async () => {
      const validation = await usersService.list();

      await expect(controller.data(2)).rejects.toThrow(new NotFoundException("Usuário não encontrado"));
      expect(validation.list.length).toEqual(0);
    });
  });

  describe("Destroy user", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should destroy user with id 1", async () => {
      await createDepartment();
      await createUser01();

      const req = await controller.destroy(1);

      const validation = await usersService.list();

      expect(req.message).toEqual("Usuário excluído com sucesso");
      expect(validation.list.length).toEqual(0);
    });

    it("should try destroy user with an invalid id", async () => {
      const validation = await usersService.list();

      await expect(controller.destroy(1)).rejects.toThrow(new NotFoundException("Usuário não encontrado"));
      expect(validation.list.length).toEqual(0);
    });
  });

  describe("List users", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should list all users", async () => {
      await createDepartment();
      await createUser01();

      const req = await controller.list();

      expect(req.list.length).toEqual(1);
    });
  });

  describe("Update Patch user", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should update user with id 1", async () => {
      const Udto: UpdateUserPatchDto = {
        birthDate: "01-02-2000",
        fireDate: "01-02-2000",
        hireDate: "01-02-2000",
        name: "Test 02",
        office: "Test 02",
        password: "Test.123456789",
      };

      await createDepartment();
      await createUser01();

      const req = await controller.updatePatch(1, Udto);

      const validation = await usersService.data(1);

      expect(req.message).toEqual("Usuário alterado com sucesso");
      expect(validation.data.name).toEqual("Test 02");
      expect(validation.data.office).toEqual("Test 02");
      expect(validation.data.birthDate).toEqual(new Date("01-02-2000"));
      expect(validation.data.fireDate).toEqual(new Date("01-02-2000"));
      expect(validation.data.hireDate).toEqual(new Date("01-02-2000"));
    });

    it("should try to update a nonexistent user", async () => {
      const Udto: UpdateUserPatchDto = {
        name: "Test 02",
        office: "Test 02",
      };

      await createDepartment();

      const validation = await usersService.list();

      await expect(controller.updatePatch(1, Udto)).rejects.toThrow(new NotFoundException("Usuário não encontrado"));
      expect(validation.list.length).toEqual(0);
    });

    it("should try to update with an invalid email", async () => {
      const Udto: UpdateUserPatchDto = {
        email: "test02@test.com",
      };

      await createDepartment();
      await createUser01();
      await createUser02();

      const validation = await usersService.data(1);

      await expect(controller.updatePatch(1, Udto)).rejects.toThrow(new BadRequestException("E-mail já em uso"));
      expect(validation.data.email).toEqual("test01@test.com");
    });

    it("should try to update with a nonexistent department", async () => {
      const Udto: UpdateUserPatchDto = {
        iDepartment: 2,
      };

      await createDepartment();
      await createUser01();

      const validation = await usersService.data(1);

      await expect(controller.updatePatch(1, Udto)).rejects.toThrow(
        new NotFoundException("Departamento não encontrado"),
      );
      expect(validation.data.iDepartment).toEqual(1);
    });
  });

  describe("Update Put user", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();
    });

    it("should update user with id 1", async () => {
      const Udto: UpdateUserPutDto = {
        active: false,
        address: "Test 02",
        addressCity: "Test 02",
        addressDistrict: "Test 02",
        addressNumber: 123,
        addressState: brazilianStates.SC,
        addressZipCode: "00000-000",
        birthDate: "01-01-2000",
        cpf: "222.222.222-22",
        email: "test02@test.com",
        fireDate: "01-01-2000",
        hireDate: "01-01-2000",
        iDepartment: 1,
        name: "Test 02",
        office: "Test 02",
        password: "Test.12345",
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
        phone: "(00)00000-0000",
      };

      await createDepartment();
      await createUser01();

      const req = await controller.updatePut(1, Udto);

      const validation = await usersService.data(1);

      expect(req.message).toEqual("Usuário alterado com sucesso");
      expect(validation.data.active).toEqual(false);
      expect(validation.data.address).toEqual("Test 02");
      expect(validation.data.addressCity).toEqual("Test 02");
      expect(validation.data.addressDistrict).toEqual("Test 02");
      expect(validation.data.birthDate).toEqual(new Date("01-01-2000"));
      expect(validation.data.cpf).toEqual("222.222.222-22");
      expect(validation.data.email).toEqual("test02@test.com");
      expect(validation.data.fireDate).toEqual(new Date("01-01-2000"));
      expect(validation.data.hireDate).toEqual(new Date("01-01-2000"));
    });

    it("should try to update a nonexistent user", async () => {
      const Udto: UpdateUserPutDto = {
        active: false,
        address: "Test 02",
        addressCity: "Test 02",
        addressDistrict: "Test 02",
        addressNumber: 123,
        addressState: brazilianStates.SC,
        addressZipCode: "00000-000",
        birthDate: "01-01-2000",
        cpf: "222.222.222-22",
        email: "test02@test.com",
        hireDate: "01-01-2000",
        iDepartment: 1,
        name: "Test 02",
        office: "Test 02",
        password: "Test.12345",
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
        phone: "(00)00000-0000",
      };

      await createDepartment();

      const validation = await usersService.list();

      await expect(controller.updatePatch(2, Udto)).rejects.toThrow(new NotFoundException("Usuário não encontrado"));
      expect(validation.list.length).toEqual(0);
    });

    it("should try to update with an invalid email", async () => {
      const Udto: UpdateUserPutDto = {
        active: false,
        address: "Test 02",
        addressCity: "Test 02",
        addressDistrict: "Test 02",
        addressNumber: 123,
        addressState: brazilianStates.SC,
        addressZipCode: "00000-000",
        birthDate: "01-01-2000",
        cpf: "222.222.222-22",
        email: "test02@test.com",
        hireDate: "01-01-2000",
        iDepartment: 1,
        name: "Test 02",
        office: "Test 02",
        password: "Test.12345",
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
        phone: "(00)00000-0000",
      };

      await createDepartment();
      await createUser01();
      await createUser02();

      const validation = await usersService.data(1);

      await expect(controller.updatePatch(1, Udto)).rejects.toThrow(new BadRequestException("E-mail já em uso"));
      expect(validation.data.email).toEqual("test01@test.com");
    });

    it("should try to update with a nonexistent department", async () => {
      const Udto: UpdateUserPutDto = {
        active: false,
        address: "Test 02",
        addressCity: "Test 02",
        addressDistrict: "Test 02",
        addressNumber: 123,
        addressState: brazilianStates.SC,
        addressZipCode: "00000-000",
        birthDate: "01-01-2000",
        cpf: "222.222.222-22",
        email: "test02@test.com",
        hireDate: "01-01-2000",
        iDepartment: 2,
        name: "Test 02",
        office: "Test 02",
        password: "Test.12345",
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
        phone: "(00)00000-0000",
      };

      await createDepartment();
      await createUser01();

      const validation = await usersService.data(1);

      await expect(controller.updatePatch(1, Udto)).rejects.toThrow(
        new NotFoundException("Departamento não encontrado"),
      );
      expect(validation.data.iDepartment).toEqual(1);
    });
  });
});
