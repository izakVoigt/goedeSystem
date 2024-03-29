import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export const corsOptions: CorsOptions = {
  methods: ["DELETE", "GET", "PATCH", "POST", "PUT"],
  optionsSuccessStatus: 200,
  origin: "http://localhost:3000",
  preflightContinue: false,
};
