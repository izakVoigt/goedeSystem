import { Express } from "express";
import { diskStorage } from "multer";
import {
  BadRequestException,
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
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { JwtGuard } from "../../auth/guard";
import { CreateResumeDto, UpdateResumePatchDto, UpdateResumePutDto } from "./dto";
import { ResumesService } from "./resumes.service";
import { editFileName, resumeFileFilter } from "../../util/file.helper";

// File size limit of 5MB in bytes
const maxFileSize = 5242880;

@Controller("resumes")
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./upload/",
        filename: editFileName,
      }),
      fileFilter: resumeFileFilter,
      limits: {
        files: 1,
        fieldSize: maxFileSize,
      },
    }),
  )
  create(@Req() req: any, @Body() Cdto: CreateResumeDto, @UploadedFile() file: Express.Multer.File) {
    if (!file || req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    return this.resumesService.create(file, Cdto);
  }

  @UseGuards(JwtGuard)
  @Get()
  list(
    @Query("page", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) page: number,
    @Query("limit", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) limit: number,
    @Query("name") name?: string,
    @Query("iDepartment") iDepartment?: string,
  ) {
    return this.resumesService.list(page, limit, name, iDepartment);
  }

  @UseGuards(JwtGuard)
  @Delete(":id")
  destroy(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.resumesService.destroy(id);
  }

  @UseGuards(JwtGuard)
  @Get("file/:id")
  file(
    @Res({ passthrough: true }) response: Response,
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
  ) {
    return this.resumesService.file(response, id);
  }

  @UseGuards(JwtGuard)
  @Get(":id")
  data(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.resumesService.data(id);
  }

  @UseGuards(JwtGuard)
  @Patch(":id")
  updatePatch(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateResumePatchDto,
  ) {
    return this.resumesService.updatePatch(id, Udto);
  }

  @UseGuards(JwtGuard)
  @Put(":id")
  updatePut(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateResumePutDto,
  ) {
    return this.resumesService.updatePut(id, Udto);
  }
}
