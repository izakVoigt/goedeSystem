import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { JwtGuard } from "../../auth/guard";
import { CreateNotificationDto, UpdateNotificationPatchDto, UpdateNotificationPutDto } from "./dto";
import { NotificationsService } from "./notifications.service";

@UseGuards(JwtGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() Cdto: CreateNotificationDto) {
    return this.notificationsService.create(Cdto);
  }

  @Get()
  list() {
    return this.notificationsService.list();
  }

  @Delete(":id")
  destroy(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.notificationsService.destroy(id);
  }

  @Get(":id")
  data(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.notificationsService.data(id);
  }

  @Patch(":id")
  updatePatch(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateNotificationPatchDto,
  ) {
    return this.notificationsService.updatePatch(id, Udto);
  }

  @Put(":id")
  updatePut(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateNotificationPutDto,
  ) {
    return this.notificationsService.updatePut(id, Udto);
  }
}
