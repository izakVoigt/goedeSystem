import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Subject } from "rxjs";
import { Sequelize } from "sequelize-typescript";
import { databaseOptions } from "../config/database.config";

@Injectable()
export class ShutdownService implements OnModuleDestroy {
  private shutdownListener$: Subject<void> = new Subject();
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize(databaseOptions);
  }

  async onModuleDestroy() {
    await this.sequelize
      .close()
      .then(() => console.log("Database disconnected successfully"))
      .catch((err) => console.log(err));
  }

  subscribeToShutdown(shutdownFn: () => void): void {
    this.shutdownListener$.subscribe(() => shutdownFn());
  }

  shutdown() {
    this.shutdownListener$.next();
  }
}
