import { Request } from "express";
import { extname } from "path";

export const resumeFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.originalname.match(/\.(pdf)$/)) {
    req.fileValidationError = "Somente arquivos no formato PDF são permitidos";
    return callback(null, false);
  }
  callback(null, true);
};

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const ext = extname(file.originalname);
  const fileName = `${uniqueSuffix}${ext}`;
  callback(null, fileName);
};
