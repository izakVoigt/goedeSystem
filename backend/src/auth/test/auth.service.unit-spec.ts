import * as argon from "argon2";
import { BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { FindOptions } from "sequelize";

import { AuthService } from "../auth.service";
import { Users } from "../../modules/users/model/users.model";
import { IUsersModel } from "../../modules/users/model/users.type.model";
import { brazilianStates } from "../../util/enum/brazilianStates.enum";

describe("Auth Service", () => {
  let service: AuthService;

  const usersTable: IUsersModel[] = [];

  const mockJwtService = {
    signAsync: jest.fn(async () => {
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    }),
  };
  const mockSequelizeUsers = {
    findOne: jest.fn((options: FindOptions<IUsersModel>) => {
      // @ts-ignore
      const email: string = options.where.email;

      const user = usersTable.find((item) => item.email === email);

      return user;
    }),
  };

  beforeAll(async () => {
    const pass = await argon.hash("Test.123456");

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
      password: pass,
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
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(Users), useValue: mockSequelizeUsers },
        JwtService,
        { provide: JwtService, useValue: mockJwtService },
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });
  afterAll(() => {
    usersTable.length = 0;
  });

  describe("Login", () => {
    afterAll(() => {
      usersTable.length = 0;
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should send the right email and password and return token", async () => {
      const req = await service.login({ email: "test01@test.com", password: "Test.123456" });

      expect(req.accessToken).toEqual(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      );
      expect(mockSequelizeUsers.findOne).toHaveBeenCalledTimes(1);
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(1);
    });

    it("should send the right email and the wrong password", async () => {
      await expect(service.login({ email: "test01@test.com", password: "Test.123456789" })).rejects.toThrow(
        new BadRequestException("E-mail ou senha inválidos"),
      );
      expect(mockSequelizeUsers.findOne).toHaveBeenCalledTimes(1);
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(0);
    });

    it("should send the wrong email and the right password", async () => {
      await expect(service.login({ email: "test02@test.com", password: "Test.123456" })).rejects.toThrow(
        new BadRequestException("E-mail ou senha inválidos"),
      );
      expect(mockSequelizeUsers.findOne).toHaveBeenCalledTimes(1);
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(0);
    });

    it("should send the wrong email and the wrong password", async () => {
      await expect(service.login({ email: "test02@test.com", password: "Test.123456789" })).rejects.toThrow(
        new BadRequestException("E-mail ou senha inválidos"),
      );
      expect(mockSequelizeUsers.findOne).toHaveBeenCalledTimes(1);
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(0);
    });
  });
});
