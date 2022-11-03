import * as argon from "argon2";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import { AuthDto } from "./dto";
import { Users } from "../modules/users/model/users.model";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users)
    private userModel: typeof Users,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: AuthDto) {
    const { email, password } = dto;

    const user = await this.userModel.findOne({ where: { email } });

    if (!user) throw new BadRequestException("E-mail ou senha inválidos");

    const pwMatches = await argon.verify(user.password, password);

    if (!pwMatches) throw new BadRequestException("E-mail ou senha inválidos");

    return this.signToken(user.id, user.email, user.name);
  }

  async signToken(userId: number, email: string, name: string) {
    const payload = {
      sub: userId,
      email,
      name,
    };
    const secret = this.config.get("JWT_SECRET");

    const token = await this.jwt.signAsync(payload, { expiresIn: "15m", secret });

    return {
      accessToken: token,
    };
  }
}
