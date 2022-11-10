import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { MessageContactDto } from "./dto";
import { ContactsService } from "./contacts.service";

@Controller("contacts")
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @HttpCode(HttpStatus.OK)
  @Post("message")
  sendMessageContact(@Body() dto: MessageContactDto) {
    return this.contactsService.sendMessageContact(dto);
  }
}
