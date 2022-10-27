import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectModel } from "@nestjs/sequelize";
import { ExtractJwt, Strategy } from "passport-jwt";

import { Users } from "../../modules/users/model/users.model";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    @InjectModel(Users)
    private userModel: typeof Users,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("JWT_SECRET"),
    });
  }

  async validate(payload: { sub: number; email: string; name: string }) {
    const user = await this.userModel.findByPk(payload.sub, { attributes: { exclude: ["password"] } });

    return user;
  }
}
