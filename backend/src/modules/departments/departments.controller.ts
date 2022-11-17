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

@Controller("departments")
export class DepartmentsController {
  constructor(private DepartmentsService: DepartmentsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() Cdto: CreateDepartmentDto) {
    return this.DepartmentsService.create(Cdto);
  }

  @Get()
  list() {
    return this.DepartmentsService.list();
  }

  @UseGuards(JwtGuard)
  @Delete(":id")
  destroy(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.DepartmentsService.destroy(id);
  }

  @UseGuards(JwtGuard)
  @Get(":id")
  data(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.DepartmentsService.data(id);
  }

  @UseGuards(JwtGuard)
  @Patch(":id")
  updatePatch(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateDepartmentPatchDto,
  ) {
    return this.DepartmentsService.updatePatch(id, Udto);
  }

  @UseGuards(JwtGuard)
  @Put(":id")
  updatePut(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateDepartmentPutDto,
  ) {
    return this.DepartmentsService.updatePut(id, Udto);
  }
}
