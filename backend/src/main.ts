import helmet from "helmet";
import * as responseTime from "response-time";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { corsOptions } from "./config/cors.config";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(helmet());
  app.use(responseTime());

  await app.listen(18800);
}
bootstrap();
