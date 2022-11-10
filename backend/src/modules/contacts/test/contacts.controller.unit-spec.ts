import { Test, TestingModule } from "@nestjs/testing";
import { MessageContactDto } from "../dto";
import { ContactsController } from "../contacts.controller";
import { ContactsService } from "../contacts.service";

describe("Contacts Controller", () => {
  let controller: ContactsController;

  const mockContactsService = {
    sendMessageContact: jest.fn((dto: MessageContactDto) => {
      if (!dto.terms) {
        return {
          statusCode: 400,
          message: "Aceite os termos de privacidade para enviar a mensagem",
        };
      }
      return {
        statusCode: 200,
        message: "Mensagem enviada com sucesso",
      };
    }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [ContactsService],
    })
      .overrideProvider(ContactsService)
      .useValue(mockContactsService)
      .compile();

    controller = module.get<ContactsController>(ContactsController);
  });

  describe("Send message contact", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should send message", () => {
      const dto: MessageContactDto = {
        name: "Test",
        email: "test@test.com",
        phone: "(00) 00000-0000",
        subject: "Test",
        message: "Test",
        terms: true,
      };

      expect(controller.sendMessageContact(dto)).toEqual({ statusCode: 200, message: "Mensagem enviada com sucesso" });
      expect(mockContactsService.sendMessageContact).toBeCalledTimes(1);
      expect(mockContactsService.sendMessageContact).toBeCalledWith(dto);
    });

    it("should try to send message without accept the terms", () => {
      const dto: MessageContactDto = {
        name: "Test",
        email: "test@test.com",
        phone: "(00) 00000-0000",
        subject: "Test",
        message: "Test",
        terms: false,
      };

      expect(controller.sendMessageContact(dto)).toEqual({
        statusCode: 400,
        message: "Aceite os termos de privacidade para enviar a mensagem",
      });
      expect(mockContactsService.sendMessageContact).toBeCalledTimes(1);
      expect(mockContactsService.sendMessageContact).toBeCalledWith(dto);
    });
  });
});
