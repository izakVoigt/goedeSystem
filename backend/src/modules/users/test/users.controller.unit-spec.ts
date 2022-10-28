import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserDto, UpdateUserPatchDto, UpdateUserPutDto } from "../dto";
import { UsersController } from "../users.controller";
import { UsersService } from "../users.service";
import { brazilianStates } from "../../../util/enum/brazilianStates.enum";

describe("Users Controller", () => {
  let controller: UsersController;

  const mockUserService = {
    create: jest.fn((Cdto: CreateUserDto) => {
      if (Cdto.iDepartment === 1 && Cdto.email !== "test@test.com") {
        return {
          statusCode: 201,
          message: "Usuário criado com sucesso",
        };
      }
      if (Cdto.iDepartment === 1 && Cdto.email === "test@test.com") {
        return {
          statusCode: 400,
          message: "E-mail já em uso",
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
            active: true,
            address: "Test",
            addressCity: "Test",
            addressDistrict: "Test",
            addressNumber: 123,
            addressState: "SC",
            addressZipCode: "00000-000",
            birthDate: new Date(),
            cpf: "111.111.111-11",
            createdAt: new Date(),
            email: "test01@test.com",
            hireDate: new Date(),
            iDepartment: 1,
            name: "Test",
            office: "Test",
            permAccounting: true,
            permAdmin: true,
            permCorporate: true,
            permFinances: true,
            permHuman: true,
            permMarketing: true,
            permOversee: true,
            phone: "(00)00000-0000",
            updatedAt: new Date(),
          },
        };
      }
      if (id === 2) {
        return {
          statusCode: 404,
          message: "Usuário não encontrado",
        };
      }
    }),
    destroy: jest.fn((id: number) => {
      if (id === 1) {
        return {
          statusCode: 200,
          message: "Usuário excluído com sucesso",
        };
      }
      if (id === 2) {
        return {
          statusCode: 404,
          message: "Usuário não encontrado",
        };
      }
    }),
    list: jest.fn(() => {
      return {
        statusCode: 200,
        list: [
          {
            id: 1,
            active: true,
            address: "Test",
            addressCity: "Test",
            addressDistrict: "Test",
            addressNumber: 123,
            addressState: "SC",
            addressZipCode: "00000-000",
            birthDate: new Date(),
            cpf: "111.111.111-11",
            createdAt: new Date(),
            email: "test01@test.com",
            hireDate: new Date(),
            iDepartment: 1,
            name: "Test",
            office: "Test",
            permAccounting: true,
            permAdmin: true,
            permCorporate: true,
            permFinances: true,
            permHuman: true,
            permMarketing: true,
            permOversee: true,
            phone: "(00)00000-0000",
            updatedAt: new Date(),
          },
        ],
      };
    }),
    updatePatch: jest.fn((id: number, Udto: UpdateUserPatchDto) => {
      if (
        (id === 1 && !Udto.iDepartment && !Udto.email) ||
        (id === 1 && Udto.iDepartment === 1 && Udto.email !== "test@test.com")
      ) {
        return {
          statusCode: 200,
          message: "Usuário alterado com sucesso",
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
          message: "Usuário não encontrado",
        };
      }
    }),
    updatePut: jest.fn((id: number, Udto: UpdateUserPutDto) => {
      if (id === 1 && Udto.iDepartment === 1 && Udto.email !== "test@test.com") {
        return {
          statusCode: 200,
          message: "Usuário alterado com sucesso",
        };
      }
      if (id !== 1 && Udto.iDepartment === 1) {
        return {
          statusCode: 404,
          message: "Usuário não encontrado",
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
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe("DELETE user", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to delete an user with an invalid id", () => {
      const id = 2;

      expect(controller.destroy(id)).toEqual({ statusCode: 404, message: "Usuário não encontrado" });
      expect(mockUserService.destroy).toBeCalledTimes(1);
      expect(mockUserService.destroy).toBeCalledWith(id);
    });

    it("should delete the user with id 1", () => {
      const id = 1;

      expect(controller.destroy(id)).toEqual({ statusCode: 200, message: "Usuário excluído com sucesso" });
      expect(mockUserService.destroy).toBeCalledTimes(1);
      expect(mockUserService.destroy).toBeCalledWith(id);
    });
  });

  describe("GET users list", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should get the users list", () => {
      expect(controller.list()).toEqual({
        statusCode: 200,
        list: [
          {
            id: 1,
            active: true,
            address: "Test",
            addressCity: "Test",
            addressDistrict: "Test",
            addressNumber: 123,
            addressState: "SC",
            addressZipCode: "00000-000",
            birthDate: expect.any(Date),
            cpf: "111.111.111-11",
            createdAt: expect.any(Date),
            email: "test01@test.com",
            hireDate: expect.any(Date),
            iDepartment: 1,
            name: "Test",
            office: "Test",
            permAccounting: true,
            permAdmin: true,
            permCorporate: true,
            permFinances: true,
            permHuman: true,
            permMarketing: true,
            permOversee: true,
            phone: "(00)00000-0000",
            updatedAt: expect.any(Date),
          },
        ],
      });
      expect(mockUserService.list).toBeCalledTimes(1);
    });
  });

  describe("GET user data", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to get the user with an invalid id", () => {
      const id = 2;

      expect(controller.data(id)).toEqual({ statusCode: 404, message: "Usuário não encontrado" });
      expect(mockUserService.data).toBeCalledTimes(1);
      expect(mockUserService.data).toBeCalledWith(id);
    });

    it("should get the user data by id", () => {
      const id = 1;

      expect(controller.data(id)).toEqual({
        statusCode: 200,
        data: {
          id: 1,
          active: true,
          address: "Test",
          addressCity: "Test",
          addressDistrict: "Test",
          addressNumber: 123,
          addressState: "SC",
          addressZipCode: "00000-000",
          birthDate: expect.any(Date),
          cpf: "111.111.111-11",
          createdAt: expect.any(Date),
          email: "test01@test.com",
          hireDate: expect.any(Date),
          iDepartment: 1,
          name: "Test",
          office: "Test",
          permAccounting: true,
          permAdmin: true,
          permCorporate: true,
          permFinances: true,
          permHuman: true,
          permMarketing: true,
          permOversee: true,
          phone: "(00)00000-0000",
          updatedAt: expect.any(Date),
        },
      });
      expect(mockUserService.data).toBeCalledTimes(1);
      expect(mockUserService.data).toBeCalledWith(id);
    });
  });

  describe("PATCH user", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to update with an invalid id", () => {
      const id = 2;
      const Udto: UpdateUserPatchDto = {
        name: "Test",
      };

      expect(controller.updatePatch(id, Udto)).toEqual({ statusCode: 404, message: "Usuário não encontrado" });
      expect(mockUserService.updatePatch).toBeCalledTimes(1);
      expect(mockUserService.updatePatch).toBeCalledWith(id, Udto);
    });

    it("should try to update with an invalid department", () => {
      const id = 1;
      const Udto: UpdateUserPatchDto = {
        iDepartment: 2,
      };

      expect(controller.updatePatch(id, Udto)).toEqual({ statusCode: 404, message: "Departamento não encontrado" });
      expect(mockUserService.updatePatch).toBeCalledTimes(1);
      expect(mockUserService.updatePatch).toBeCalledWith(id, Udto);
    });

    it("should update the user", () => {
      const id = 1;
      const Udto: UpdateUserPatchDto = {
        name: "Test 01",
      };

      expect(controller.updatePatch(id, Udto)).toEqual({ statusCode: 200, message: "Usuário alterado com sucesso" });
      expect(mockUserService.updatePatch).toBeCalledTimes(1);
      expect(mockUserService.updatePatch).toBeCalledWith(id, Udto);
    });
  });

  describe("POST user", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to create a new user with an invalid department", () => {
      const Cdto: CreateUserDto = {
        address: "Test",
        addressCity: "Test",
        addressDistrict: "Test",
        addressNumber: 123,
        addressState: brazilianStates.SC,
        addressZipCode: "00000-00",
        birthDate: "01-01-1111",
        cpf: "111.111.111-11",
        email: "test01@test.com",
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
      };

      expect(controller.create(Cdto)).toEqual({ statusCode: 404, message: "Departamento não encontrado" });
      expect(mockUserService.create).toBeCalledTimes(1);
      expect(mockUserService.create).toBeCalledWith(Cdto);
    });

    it("should create a new user", () => {
      const Cdto: CreateUserDto = {
        address: "Test",
        addressCity: "Test",
        addressDistrict: "Test",
        addressNumber: 123,
        addressState: brazilianStates.SC,
        addressZipCode: "00000-00",
        birthDate: "01-01-1111",
        cpf: "111.111.111-11",
        email: "test01@test.com",
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
      };

      expect(controller.create(Cdto)).toEqual({ statusCode: 201, message: "Usuário criado com sucesso" });
      expect(mockUserService.create).toBeCalledTimes(1);
      expect(mockUserService.create).toBeCalledWith(Cdto);
    });
  });

  describe("PUT user", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to update with an invalid id", () => {
      const id = 2;
      const Udto: UpdateUserPutDto = {
        active: true,
        address: "Test",
        addressCity: "Test",
        addressDistrict: "Test",
        addressNumber: 123,
        addressState: brazilianStates.SC,
        addressZipCode: "00000-00",
        birthDate: "01-01-1111",
        cpf: "111.111.111-11",
        email: "test01@test.com",
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
      };

      expect(controller.updatePut(id, Udto)).toEqual({ statusCode: 404, message: "Usuário não encontrado" });
      expect(mockUserService.updatePut).toBeCalledTimes(1);
      expect(mockUserService.updatePut).toBeCalledWith(id, Udto);
    });

    it("should try to update with an invalid department", () => {
      const id = 1;
      const Udto: UpdateUserPutDto = {
        active: true,
        address: "Test",
        addressCity: "Test",
        addressDistrict: "Test",
        addressNumber: 123,
        addressState: brazilianStates.SC,
        addressZipCode: "00000-00",
        birthDate: "01-01-1111",
        cpf: "111.111.111-11",
        email: "test01@test.com",
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
      };

      expect(controller.updatePut(id, Udto)).toEqual({ statusCode: 404, message: "Departamento não encontrado" });
      expect(mockUserService.updatePut).toBeCalledTimes(1);
      expect(mockUserService.updatePut).toBeCalledWith(id, Udto);
    });

    it("should update the user", () => {
      const id = 1;
      const Udto: UpdateUserPutDto = {
        active: true,
        address: "Test",
        addressCity: "Test",
        addressDistrict: "Test",
        addressNumber: 123,
        addressState: brazilianStates.SC,
        addressZipCode: "00000-00",
        birthDate: "01-01-1111",
        cpf: "111.111.111-11",
        email: "test01@test.com",
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
      };

      expect(controller.updatePut(id, Udto)).toEqual({ statusCode: 200, message: "Usuário alterado com sucesso" });
      expect(mockUserService.updatePut).toBeCalledTimes(1);
      expect(mockUserService.updatePut).toBeCalledWith(id, Udto);
    });
  });
});
