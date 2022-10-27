import { Injectable } from "@nestjs/common";

@Injectable()
export class RootService {
  root() {
    return { message: "Goede API" };
  }
}
