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
import { CreatePermissionDto, UpdatePermissionPatchDto, UpdatePermissionPutDto } from "./dto";
import { PermissionsService } from "./permissions.service";

@UseGuards(JwtGuard)
@Controller("permissions")
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() Cdto: CreatePermissionDto) {
    return this.permissionsService.create(Cdto);
  }

  @Delete(":id")
  destroy(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.permissionsService.destroy(id);
  }

  @Get(":id")
  data(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.permissionsService.data(id);
  }

  @Patch(":id")
  updatePatch(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdatePermissionPatchDto,
  ) {
    return this.permissionsService.updatePatch(id, Udto);
  }

  @Put(":id")
  updatePut(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdatePermissionPutDto,
  ) {
    return this.permissionsService.updatePut(id, Udto);
  }
}
