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
import { CreateDepartmentDto, UpdateDepartmentPatchDto, UpdateDepartmentPutDto } from "./dto";
import { DepartmentsService } from "./departments.service";

@UseGuards(JwtGuard)
@Controller("departments")
export class DepartmentsController {
  constructor(private DepartmentsService: DepartmentsService) {}

  @Post()
  create(@Body() Cdto: CreateDepartmentDto) {
    return this.DepartmentsService.create(Cdto);
  }

  @Get()
  list() {
    return this.DepartmentsService.list();
  }

  @Delete(":id")
  destroy(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.DepartmentsService.destroy(id);
  }

  @Get(":id")
  data(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.DepartmentsService.data(id);
  }

  @Patch(":id")
  updatePatch(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateDepartmentPatchDto,
  ) {
    return this.DepartmentsService.updatePatch(id, Udto);
  }

  @Put(":id")
  updatePut(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateDepartmentPutDto,
  ) {
    return this.DepartmentsService.updatePut(id, Udto);
  }
}
