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
import { CreateVacancyDto, UpdateVacancyPatchDto, UpdateVacancyPutDto } from "./dto";
import { VacanciesService } from "./vacancies.service";

@Controller("vacancies")
export class VacanciesController {
  constructor(private readonly VacanciesService: VacanciesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() Cdto: CreateVacancyDto) {
    return this.VacanciesService.create(Cdto);
  }

  @Get()
  list() {
    return this.VacanciesService.list();
  }

  @UseGuards(JwtGuard)
  @Delete(":id")
  destroy(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.VacanciesService.destroy(id);
  }

  @Get(":id")
  data(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.VacanciesService.data(id);
  }

  @UseGuards(JwtGuard)
  @Patch(":id")
  updatePatch(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateVacancyPatchDto,
  ) {
    return this.VacanciesService.updatePatch(id, Udto);
  }

  @UseGuards(JwtGuard)
  @Put(":id")
  updatePut(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateVacancyPutDto,
  ) {
    return this.VacanciesService.updatePut(id, Udto);
  }
}
