import { BadRequestException, NotFoundException } from "@nestjs/common";
import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { DestroyOptions, FindOptions, UpdateOptions } from "sequelize";

import { UsersService } from "../users.service";
import { DepartmentsService } from "../../departments/departments.service";
import { Departments } from "../../departments/model/departments.model";
import { IDepartmentsModel } from "../../departments/model/departments.type.model";
import { Users } from "../model/users.model";
import { IUsersModel } from "../model/users.type.model";
import { brazilianStates } from "../../../util/enum/brazilianStates.enum";

describe("Users Service", () => {
  let service: UsersService;

  const usersTable: IUsersModel[] = [];

  const departmentsTable: IDepartmentsModel[] = [];

  const mockSequelizeDepartments = {
    findByPk: jest.fn((id: number) => {
      const department = departmentsTable.find((item) => item.id === id);

      return department;
    }),
  };

  const mockSequelizeUsers = {
    create: jest.fn(
      (
        active: boolean,
        address: string,
        addressCity: string,
        addressDistrict: string,
        addressNumber: number,
        addressState: brazilianStates,
        addressZipCode: string,
        birthDate: string,
        cpf: string,
        email: string,
        hireDate: string,
        iDepartment: number,
        name: string,
        office: string,
        password: string,
        permAccounting: boolean,
        permAdmin: boolean,
        permCorporate: boolean,
        permFinances: boolean,
        permHuman: boolean,
        permMarketing: boolean,
        permOversee: boolean,
        phone: string,
        fireDate?: string,
      ) => {
        usersTable.push({
          id: usersTable.length + 1,
          active,
          address,
          addressCity,
          addressDistrict,
          addressNumber,
          addressState,
          addressZipCode,
          birthDate: new Date(birthDate),
          cpf,
          createdAt: new Date(),
          email,
          fireDate: new Date(fireDate),
          hireDate: new Date(hireDate),
          iDepartment,
          name,
          office,
          password,
          permAccounting,
          permAdmin,
          permCorporate,
          permFinances,
          permHuman,
          permMarketing,
          permOversee,
          phone,
          updatedAt: new Date(),
        });

        return usersTable.slice(-1);
      },
    ),
    destroy: jest.fn((options?: DestroyOptions<IUsersModel>) => {
      // @ts-ignore
      const id: number = options.where.id;

      const itemIndex = usersTable.findIndex((item) => item.id === id);

      usersTable.splice(itemIndex, 1);
    }),
    findAll: jest.fn(() => {
      return usersTable;
    }),
    findByPk: jest.fn((id: number) => {
      const user = usersTable.find((item) => item.id === id);

      return user;
    }),
    findOne: jest.fn((options: FindOptions<IUsersModel>) => {
      // @ts-ignore
      const email: string = options.where.email;

      const user = usersTable.find((item) => item.email === email);

      return user;
    }),
    update: jest.fn(
      (
        values: {
          id: number;
          active: boolean;
          address: string;
          addressCity: string;
          addressDistrict: string;
          addressNumber: number;
          addressState: brazilianStates;
          addressZipCode: string;
          birthDate: Date;
          cpf: string;
          createdAt: Date;
          deletedAt?: Date;
          email: string;
          fireDate?: Date;
          hireDate: Date;
          iDepartment: number;
          name: string;
          office: string;
          password: string;
          permAccounting: boolean;
          permAdmin: boolean;
          permCorporate: boolean;
          permFinances: boolean;
          permHuman: boolean;
          permMarketing: boolean;
          permOversee: boolean;
          phone: string;
          updatedAt: Date;
        },
        options?: UpdateOptions<IUsersModel>,
      ) => {
        // @ts-ignore
        const id: number = options.where.id;

        const data = usersTable.findIndex((item) => item.id === id);

        if (values.active) {
          usersTable[data].active = values.active;
          usersTable[data].updatedAt = new Date();
        }
        if (values.address) {
          usersTable[data].address = values.address;
          usersTable[data].updatedAt = new Date();
        }
        if (values.addressCity) {
          usersTable[data].addressCity = values.addressCity;
          usersTable[data].updatedAt = new Date();
        }
        if (values.addressDistrict) {
          usersTable[data].addressDistrict = values.addressDistrict;
          usersTable[data].updatedAt = new Date();
        }
        if (values.addressNumber) {
          usersTable[data].addressNumber = values.addressNumber;
          usersTable[data].updatedAt = new Date();
        }
        if (values.addressState) {
          usersTable[data].addressState = values.addressState;
          usersTable[data].updatedAt = new Date();
        }
        if (values.addressZipCode) {
          usersTable[data].addressZipCode = values.addressZipCode;
          usersTable[data].updatedAt = new Date();
        }
        if (values.birthDate) {
          usersTable[data].birthDate = values.birthDate;
          usersTable[data].updatedAt = new Date();
        }
        if (values.cpf) {
          usersTable[data].cpf = values.cpf;
          usersTable[data].updatedAt = new Date();
        }
        if (values.createdAt) {
          usersTable[data].createdAt = values.createdAt;
          usersTable[data].updatedAt = new Date();
        }
        if (values.deletedAt) {
          usersTable[data].deletedAt = values.deletedAt;
          usersTable[data].updatedAt = new Date();
        }
        if (values.email) {
          usersTable[data].email = values.email;
          usersTable[data].updatedAt = new Date();
        }
        if (values.fireDate) {
          usersTable[data].fireDate = values.fireDate;
          usersTable[data].updatedAt = new Date();
        }
        if (values.hireDate) {
          usersTable[data].hireDate = values.hireDate;
          usersTable[data].updatedAt = new Date();
        }
        if (values.iDepartment) {
          usersTable[data].iDepartment = values.iDepartment;
          usersTable[data].updatedAt = new Date();
        }
        if (values.name) {
          usersTable[data].name = values.name;
          usersTable[data].updatedAt = new Date();
        }
        if (values.office) {
          usersTable[data].office = values.office;
          usersTable[data].updatedAt = new Date();
        }
        if (values.password) {
          usersTable[data].password = values.password;
          usersTable[data].updatedAt = new Date();
        }
        if (values.permAccounting) {
          usersTable[data].permAccounting = values.permAccounting;
          usersTable[data].updatedAt = new Date();
        }
        if (values.permAdmin) {
          usersTable[data].permAdmin = values.permAdmin;
          usersTable[data].updatedAt = new Date();
        }
        if (values.permCorporate) {
          usersTable[data].permCorporate = values.permCorporate;
          usersTable[data].updatedAt = new Date();
        }
        if (values.permFinances) {
          usersTable[data].permFinances = values.permFinances;
          usersTable[data].updatedAt = new Date();
        }
        if (values.permHuman) {
          usersTable[data].permHuman = values.permHuman;
          usersTable[data].updatedAt = new Date();
        }
        if (values.permMarketing) {
          usersTable[data].permMarketing = values.permMarketing;
          usersTable[data].updatedAt = new Date();
        }
        if (values.permOversee) {
          usersTable[data].permOversee = values.permOversee;
          usersTable[data].updatedAt = new Date();
        }
        if (values.phone) {
          usersTable[data].phone = values.phone;
          usersTable[data].updatedAt = new Date();
        }
      },
    ),
  };

  const createUserId01 = () => {
    usersTable.push({
      id: 1,
      active: true,
      address: "Test",
      addressCity: "Test",
      addressDistrict: "Test",
      addressNumber: 123,
      addressState: brazilianStates.SC,
      addressZipCode: "00000-000",
      birthDate: new Date(),
      cpf: "111.111.111-11",
      createdAt: new Date(),
      email: "test01@test.com",
      hireDate: new Date(),
      iDepartment: 1,
      name: "Test",
      office: "Test",
      password: "Test.123456",
      permAccounting: true,
      permAdmin: true,
      permCorporate: true,
      permFinances: true,
      permHuman: true,
      permMarketing: true,
      permOversee: true,
      phone: "(00)00000-0000",
      updatedAt: new Date(),
    });
  };

  const createUserId02 = () => {
    usersTable.push({
      id: usersTable.length + 1,
      active: true,
      address: "Test 01",
      addressCity: "Test 01",
      addressDistrict: "Test 01",
      addressNumber: 123,
      addressState: brazilianStates.SC,
      addressZipCode: "00000-000",
      birthDate: new Date(),
      cpf: "111.111.111-11",
      createdAt: new Date(),
      email: "test02@test.com",
      hireDate: new Date(),
      iDepartment: 1,
      name: "Test 01",
      office: "Test 01",
      password: "Test.123456",
      permAccounting: true,
      permAdmin: true,
      permCorporate: true,
      permFinances: true,
      permHuman: true,
      permMarketing: true,
      permOversee: true,
      phone: "(00)00000-0000",
      updatedAt: new Date(),
    });
  };

  beforeAll(() => {
    departmentsTable.push({
      id: departmentsTable.length + 1,
      createdAt: new Date(),
      description: "Test",
      name: "Test",
      updatedAt: new Date(),
    });
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(Users), useValue: mockSequelizeUsers },
        DepartmentsService,
        { provide: getModelToken(Departments), useValue: mockSequelizeDepartments },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });
  afterAll(() => {
    usersTable.length = 0;
    departmentsTable.length = 0;
  });

  describe("Create user", () => {
    afterAll(() => {
      usersTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should create a new user", async () => {
      const req = await service.create({
        address: "Test",
        addressCity: "Test",
        addressDistrict: "Test",
        addressNumber: 123,
        addressState: brazilianStates.SC,
        addressZipCode: "00000-000",
        birthDate: "01-01-1111",
        cpf: "111.111.111-11",
        email: "test@test.com",
        hireDate: "01-01-1111",
        iDepartment: 1,
        name: "Test",
        office: "Test",
        password: "Test.123456",
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
        phone: "(00)00000-0000",
      });

      expect(req.message).toEqual("Usuário criado com sucesso");
      expect(mockSequelizeUsers.findOne).toHaveBeenCalledTimes(1);
      expect(mockSequelizeDepartments.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeUsers.create).toHaveBeenCalledTimes(1);
    });

    it("should try to create a new user with an invalid department id", async () => {
      await expect(
        service.create({
          address: "Test",
          addressCity: "Test",
          addressDistrict: "Test",
          addressNumber: 123,
          addressState: brazilianStates.SC,
          addressZipCode: "00000-000",
          birthDate: "01-01-1111",
          cpf: "111.111.111-11",
          email: "test@test.com",
          hireDate: "01-01-1111",
          iDepartment: 2,
          name: "Test",
          office: "Test",
          password: "Test.123456",
          permAccounting: true,
          permAdmin: true,
          permCorporate: true,
          permFinances: true,
          permHuman: true,
          permMarketing: true,
          permOversee: true,
          phone: "(00)00000-0000",
        }),
      ).rejects.toThrow(new NotFoundException("Departamento não encontrado"));
      expect(mockSequelizeUsers.findOne).toHaveBeenCalledTimes(1);
      expect(mockSequelizeDepartments.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeUsers.create).toHaveBeenCalledTimes(0);
    });

    it("should try to create a new user with an invalid email", async () => {
      createUserId02();

      await expect(
        service.create({
          address: "Test 01",
          addressCity: "Test 01",
          addressDistrict: "Test 01",
          addressNumber: 123,
          addressState: brazilianStates.SC,
          addressZipCode: "00000-000",
          birthDate: "01-01-1111",
          cpf: "111.111.111-11",
          email: "test02@test.com",
          hireDate: "01-01-1111",
          iDepartment: 1,
          name: "Test 01",
          office: "Test 01",
          password: "Test.123456",
          permAccounting: true,
          permAdmin: true,
          permCorporate: true,
          permFinances: true,
          permHuman: true,
          permMarketing: true,
          permOversee: true,
          phone: "(00)00000-0000",
        }),
      ).rejects.toThrow(new BadRequestException("E-mail já em uso"));
      expect(mockSequelizeUsers.findOne).toHaveBeenCalledTimes(1);
      expect(mockSequelizeDepartments.findByPk).toHaveBeenCalledTimes(0);
      expect(mockSequelizeUsers.create).toHaveBeenCalledTimes(0);
    });
  });

  describe("Data user", () => {
    beforeAll(() => {
      createUserId01();
    });
    afterAll(() => {
      usersTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should get user data", async () => {
      const req = await service.data({ id: 1 });

      expect(req.data).toEqual({
        id: 1,
        active: true,
        address: "Test",
        addressCity: "Test",
        addressDistrict: "Test",
        addressNumber: 123,
        addressState: brazilianStates.SC,
        addressZipCode: "00000-000",
        birthDate: expect.any(Date),
        cpf: "111.111.111-11",
        createdAt: expect.any(Date),
        email: "test01@test.com",
        hireDate: expect.any(Date),
        iDepartment: 1,
        name: "Test",
        office: "Test",
        password: "Test.123456",
        permAccounting: true,
        permAdmin: true,
        permCorporate: true,
        permFinances: true,
        permHuman: true,
        permMarketing: true,
        permOversee: true,
        phone: "(00)00000-0000",
        updatedAt: expect.any(Date),
      });
      expect(mockSequelizeUsers.findByPk).toHaveBeenCalledTimes(1);
    });

    it("should try to get user data from a invalid id", async () => {
      await expect(service.data({ id: 2 })).rejects.toThrow(new NotFoundException("Usuário não encontrado"));
      expect(mockSequelizeUsers.findByPk).toHaveBeenCalledTimes(1);
    });
  });

  describe("Destroy user", () => {
    beforeAll(() => {
      createUserId01();
    });
    afterAll(() => {
      usersTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should destroy user with id 1", async () => {
      const req = await service.destroy({ id: 1 });

      expect(req.message).toEqual("Usuário excluído com sucesso");
      expect(mockSequelizeUsers.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeUsers.destroy).toHaveBeenCalledTimes(1);
      expect(usersTable.length).toEqual(0);
    });

    it("should try to destroy an user with an invalid id", async () => {
      await expect(service.destroy({ id: 2 })).rejects.toThrow(new NotFoundException("Usuário não encontrado"));
      expect(mockSequelizeUsers.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeUsers.destroy).toHaveBeenCalledTimes(0);
    });
  });

  describe("List user", () => {
    beforeAll(() => {
      createUserId01();
    });
    afterAll(() => {
      usersTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should list all users", async () => {
      const req = await service.list();

      expect(req.list).toHaveLength(1);
      expect(mockSequelizeUsers.findAll).toHaveBeenCalledTimes(1);
    });

    it("should try to list all user with an empty table", async () => {
      usersTable.length = 0;

      const req = await service.list();

      expect(req.list).toHaveLength(0);
      expect(mockSequelizeUsers.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("UpdatePatch user", () => {
    beforeAll(() => {
      createUserId01();
    });
    afterAll(() => {
      usersTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should update user with id 1", async () => {
      const req = await service.updatePatch(
        { id: 1 },
        { iDepartment: 1, name: "Test 02", office: "Test 02", password: "Test@654321" },
      );

      expect(req.message).toEqual("Usuário alterado com sucesso");
      expect(mockSequelizeUsers.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeUsers.findOne).toHaveBeenCalledTimes(0);
      expect(mockSequelizeUsers.update).toHaveBeenCalledTimes(1);
      expect(usersTable[0].name).toEqual("Test 02");
      expect(usersTable[0].office).toEqual("Test 02");
    });

    it("should try to update with an invalid department id", async () => {
      await expect(service.updatePatch({ id: 1 }, { iDepartment: 2, name: "Test 03" })).rejects.toThrow(
        new NotFoundException("Departamento não encontrado"),
      );
      expect(mockSequelizeUsers.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeUsers.findOne).toHaveBeenCalledTimes(0);
      expect(mockSequelizeDepartments.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeUsers.update).toHaveBeenCalledTimes(0);
      expect(usersTable[0].name).toEqual("Test 02");
      expect(usersTable[0].iDepartment).toEqual(1);
    });

    it("should try to update with an invalid email", async () => {
      createUserId02();

      await expect(service.updatePatch({ id: 1 }, { email: "test02@test.com" })).rejects.toThrow(
        new BadRequestException("E-mail já em uso"),
      );
      expect(mockSequelizeUsers.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeUsers.findOne).toHaveBeenCalledTimes(1);
      expect(mockSequelizeDepartments.findByPk).toHaveBeenCalledTimes(0);
      expect(mockSequelizeUsers.update).toHaveBeenCalledTimes(0);
      expect(usersTable[0].name).toEqual("Test 02");
      expect(usersTable[0].iDepartment).toEqual(1);
    });

    it("should try to update with an invalid id", async () => {
      await expect(service.updatePatch({ id: 3 }, { name: "Test 03" })).rejects.toThrow(
        new NotFoundException("Usuário não encontrado"),
      );
      expect(mockSequelizeUsers.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeUsers.findOne).toHaveBeenCalledTimes(0);
      expect(mockSequelizeDepartments.findByPk).toHaveBeenCalledTimes(0);
      expect(mockSequelizeUsers.update).toHaveBeenCalledTimes(0);
      expect(usersTable[0].name).toEqual("Test 02");
    });
  });

  describe("UpdatePut user", () => {
    beforeAll(() => {
      createUserId01();
    });
    afterAll(() => {
      usersTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should update user with id 1", async () => {
      const req = await service.updatePut(
        { id: 1 },
        {
          active: false,
          address: "Test 02",
          addressCity: "Test 02",
          addressDistrict: "Test 02",
          addressNumber: 321,
          addressState: brazilianStates.AC,
          addressZipCode: "11111-111",
          birthDate: "02-02-2222",
          cpf: "222.222.222-22",
          email: "test03@test.com",
          hireDate: "02-02-2222",
          iDepartment: 1,
          name: "Test 02",
          office: "Test 02",
          password: "Test.123456",
          permAccounting: false,
          permAdmin: false,
          permCorporate: false,
          permFinances: false,
          permHuman: false,
          permMarketing: false,
          permOversee: false,
          phone: "(22)22222-2222",
        },
      );

      expect(req.message).toEqual("Usuário alterado com sucesso");
      expect(mockSequelizeUsers.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeUsers.findOne).toHaveBeenCalledTimes(1);
      expect(mockSequelizeDepartments.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeUsers.update).toHaveBeenCalledTimes(1);
      expect(usersTable[0].name).toEqual("Test 02");
      expect(usersTable[0].office).toEqual("Test 02");
    });

    it("should try to update with an invalid department id", async () => {
      await expect(
        service.updatePut(
          { id: 1 },
          {
            active: false,
            address: "Test 02",
            addressCity: "Test 02",
            addressDistrict: "Test 02",
            addressNumber: 321,
            addressState: brazilianStates.AC,
            addressZipCode: "11111-111",
            birthDate: "02-02-2222",
            cpf: "222.222.222-22",
            email: "test03@test.com",
            hireDate: "02-02-2222",
            iDepartment: 2,
            name: "Test 02",
            office: "Test 02",
            password: "Test.123456",
            permAccounting: false,
            permAdmin: false,
            permCorporate: false,
            permFinances: false,
            permHuman: false,
            permMarketing: false,
            permOversee: false,
            phone: "(22)22222-2222",
          },
        ),
      ).rejects.toThrow(new NotFoundException("Departamento não encontrado"));
      expect(mockSequelizeUsers.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeUsers.findOne).toHaveBeenCalledTimes(1);
      expect(mockSequelizeDepartments.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeUsers.update).toHaveBeenCalledTimes(0);
      expect(usersTable[0].name).toEqual("Test 02");
      expect(usersTable[0].iDepartment).toEqual(1);
    });

    it("should try to update with an invalid email", async () => {
      createUserId02();

      await expect(
        service.updatePut(
          { id: 1 },
          {
            active: false,
            address: "Test 02",
            addressCity: "Test 02",
            addressDistrict: "Test 02",
            addressNumber: 321,
            addressState: brazilianStates.AC,
            addressZipCode: "11111-111",
            birthDate: "02-02-2222",
            cpf: "222.222.222-22",
            email: "test02@test.com",
            hireDate: "02-02-2222",
            iDepartment: 1,
            name: "Test 01",
            office: "Test 02",
            password: "Test.123456",
            permAccounting: false,
            permAdmin: false,
            permCorporate: false,
            permFinances: false,
            permHuman: false,
            permMarketing: false,
            permOversee: false,
            phone: "(22)22222-2222",
          },
        ),
      ).rejects.toThrow(new BadRequestException("E-mail já em uso"));
      expect(mockSequelizeUsers.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeUsers.findOne).toHaveBeenCalledTimes(1);
      expect(mockSequelizeDepartments.findByPk).toHaveBeenCalledTimes(0);
      expect(mockSequelizeUsers.update).toHaveBeenCalledTimes(0);
      expect(usersTable[0].name).toEqual("Test 02");
      expect(usersTable[0].iDepartment).toEqual(1);
    });

    it("should try to update with an invalid id", async () => {
      await expect(
        service.updatePut(
          { id: 3 },
          {
            active: false,
            address: "Test 02",
            addressCity: "Test 02",
            addressDistrict: "Test 02",
            addressNumber: 321,
            addressState: brazilianStates.AC,
            addressZipCode: "11111-111",
            birthDate: "02-02-2222",
            cpf: "222.222.222-22",
            email: "test03@test.com",
            hireDate: "02-02-2222",
            iDepartment: 1,
            name: "Test 02",
            office: "Test 02",
            password: "Test.123456",
            permAccounting: false,
            permAdmin: false,
            permCorporate: false,
            permFinances: false,
            permHuman: false,
            permMarketing: false,
            permOversee: false,
            phone: "(22)22222-2222",
          },
        ),
      ).rejects.toThrow(new NotFoundException("Usuário não encontrado"));
      expect(mockSequelizeUsers.findByPk).toHaveBeenCalledTimes(1);
      expect(mockSequelizeUsers.findOne).toHaveBeenCalledTimes(0);
      expect(mockSequelizeDepartments.findByPk).toHaveBeenCalledTimes(0);
      expect(mockSequelizeUsers.update).toHaveBeenCalledTimes(0);
      expect(usersTable[0].name).toEqual("Test 02");
    });
  });
});
