import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthDto } from "./dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
}
