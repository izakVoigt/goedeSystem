import { Test, TestingModule } from "@nestjs/testing";

import { AuthDto } from "../dto";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";

describe("AuthController", () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn((dto: AuthDto) => {
      if (dto.email !== "test@test.com" || dto.password !== "Test.12345") {
        return {
          statusCode: 400,
          message: "E-mail ou senha inválidos",
        };
      }
      if (dto.email === "test@test.com" && dto.password === "Test.12345") {
        return {
          statusCode: 200,
          accessToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        };
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe("POST login", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should try to login sending an invalid email", () => {
      const dto: AuthDto = {
        email: "test01@test.com",
        password: "Test.12345",
      };

      expect(controller.login(dto)).toEqual({ statusCode: 400, message: "E-mail ou senha inválidos" });
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
      expect(mockAuthService.login).toBeCalledWith(dto);
    });

    it("should send an invalid password and return 'E-mail ou senha inválidos'", () => {
      const dto: AuthDto = {
        email: "test@test.com",
        password: "Test.*12345678",
      };

      expect(controller.login(dto)).toEqual({ statusCode: 400, message: "E-mail ou senha inválidos" });
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
      expect(mockAuthService.login).toBeCalledWith(dto);
    });

    it("should send a valid email and password and return the access token", () => {
      const dto: AuthDto = {
        email: "test@test.com",
        password: "Test.12345",
      };

      expect(controller.login(dto)).toEqual({
        statusCode: 200,
        accessToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      });
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
      expect(mockAuthService.login).toBeCalledWith(dto);
    });
  });
});
