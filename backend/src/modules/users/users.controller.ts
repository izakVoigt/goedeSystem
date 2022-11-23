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
import { CreateUserDto, UpdateUserPatchDto, UpdateUserPutDto } from "./dto";
import { UsersService } from "./users.service";

@UseGuards(JwtGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() Cdto: CreateUserDto) {
    return this.usersService.create(Cdto);
  }

  @Get()
  list(
    @Query("page", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) page: number,
    @Query("limit", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) limit: number,
    @Query("query") query?: string,
    @Query("iDepartment") iDepartment?: string,
  ) {
    return this.usersService.list(page, limit, query, iDepartment);
  }

  @Delete(":id")
  destroy(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.usersService.destroy(id);
  }

  @Get(":id")
  data(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.usersService.data(id);
  }

  @Patch(":id")
  updatePatch(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateUserPatchDto,
  ) {
    return this.usersService.updatePatch(id, Udto);
  }

  @Put(":id")
  updatePut(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateUserPutDto,
  ) {
    return this.usersService.updatePut(id, Udto);
  }
}
