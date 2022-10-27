import { Controller, Get } from "@nestjs/common";
import { RootService } from "./root.service";

@Controller()
export class RootController {
  constructor(private RootService: RootService) {}

  @Get()
  root() {
    return this.RootService.root();
  }
}
