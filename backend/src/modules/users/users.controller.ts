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
import { CreateUserDto, UpdateUserPatchDto, UpdateUserPutDto } from "./dto";
import { UsersService } from "./users.service";

@UseGuards(JwtGuard)
@Controller("users")
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Post()
  create(@Body() Cdto: CreateUserDto) {
    return this.UsersService.create(Cdto);
  }

  @Get()
  list() {
    return this.UsersService.list();
  }

  @Delete(":id")
  destroy(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.UsersService.destroy(id);
  }

  @Get(":id")
  data(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.UsersService.data(id);
  }

  @Patch(":id")
  updatePatch(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateUserPatchDto,
  ) {
    return this.UsersService.updatePatch(id, Udto);
  }

  @Put(":id")
  updatePut(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateUserPutDto,
  ) {
    return this.UsersService.updatePut(id, Udto);
  }
}
