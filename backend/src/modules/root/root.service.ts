import * as fs from "fs-extra";
import { Injectable, StreamableFile } from "@nestjs/common";
import { Response } from "express";

@Injectable()
export class RootService {
  root() {
    return { message: "Goede API" };
  }

  async lgpdFile(response: Response) {
    const fileBuffer = await fs.readFile("files/FormularioPedidoExercicioDireitosTitular.pdf");

    response.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="FormularioPedidoExercicioDireitosTitular.pdf"',
    });

    return new StreamableFile(fileBuffer, { type: "application/pdf" });
  }
}
