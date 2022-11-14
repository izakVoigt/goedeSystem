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
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtGuard } from "../../auth/guard";
import { CreateResumeDto, UpdateResumePatchDto, UpdateResumePutDto } from "./dto";
import { ResumesService } from "./resumes.service";
import { editFileName, resumeFileFilter } from "../../util/file.helper";

// File size limit of 5MB in bytes
const maxFileSize = 5242880;

@Controller("resumes")
export class ResumesController {
  constructor(private ResumesService: ResumesService) {}

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
    return this.ResumesService.create(file, Cdto);
  }

  @UseGuards(JwtGuard)
  @Get()
  list() {
    return this.ResumesService.list();
  }

  @UseGuards(JwtGuard)
  @Delete(":id")
  destroy(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.ResumesService.destroy(id);
  }

  @UseGuards(JwtGuard)
  @Get("file/:id")
  file(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.ResumesService.file(id);
  }

  @UseGuards(JwtGuard)
  @Get(":id")
  data(@Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.ResumesService.data(id);
  }

  @UseGuards(JwtGuard)
  @Patch(":id")
  updatePatch(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateResumePatchDto,
  ) {
    return this.ResumesService.updatePatch(id, Udto);
  }

  @UseGuards(JwtGuard)
  @Put(":id")
  updatePut(
    @Param("id", new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() Udto: UpdateResumePutDto,
  ) {
    return this.ResumesService.updatePut(id, Udto);
  }
}
