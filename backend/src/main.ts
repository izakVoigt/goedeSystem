import helmet from "helmet";
import * as bodyParser from "body-parser";
import * as responseTime from "response-time";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { corsOptions } from "./config/cors.config";
import { AppModule } from "./app.module";
import { ShutdownService } from "./services/shutdown.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });

  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(helmet());
  app.use(responseTime());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.enableShutdownHooks();
  app.get(ShutdownService).subscribeToShutdown(() => app.close());

  await app.listen(18800);
}
bootstrap();
