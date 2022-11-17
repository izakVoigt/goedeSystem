import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { RootService } from "./root.service";

@Controller()
export class RootController {
  constructor(private rootService: RootService) {}

  @Get()
  root() {
    return this.rootService.root();
  }

  @Get("lgpd/form")
  lgpdFile(@Res({ passthrough: true }) response: Response) {
    return this.rootService.lgpdFile(response);
  }
}
