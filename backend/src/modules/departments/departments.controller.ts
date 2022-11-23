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
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtGuard } from "../../auth/guard";
import { CreateDepartmentDto, UpdateDepartmentPatchDto, UpdateDepartmentPutDto } from "./dto";
import { DepartmentsService } from "./departments.service";

@Controller("departments")
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() Cdto: CreateDepartmentDto) {
    return this.departmentsService.create(Cdto);
  }

  @Get()
  list(
    @Query("page", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) page: number,
    @Query("limit", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) limit: number,
    @Query("name") name: string,
  ) {
    return this.departmentsService.list(page, limit, name);
  }

  @UseGuards(JwtGuard)
  @Delete(":id")
  destroy(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.departmentsService.destroy(id);
  }

  @UseGuards(JwtGuard)
  @Get(":id")
  data(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.departmentsService.data(id);
  }

  @UseGuards(JwtGuard)
  @Patch(":id")
  updatePatch(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateDepartmentPatchDto,
  ) {
    return this.departmentsService.updatePatch(id, Udto);
  }

  @UseGuards(JwtGuard)
  @Put(":id")
  updatePut(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateDepartmentPutDto,
  ) {
    return this.departmentsService.updatePut(id, Udto);
  }
}
