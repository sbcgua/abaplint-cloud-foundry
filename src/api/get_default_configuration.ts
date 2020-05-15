import { Config, IConfig } from "@abaplint/core";
import type { Request, Response } from "express";
import { createSuccessResponse } from "./api-types";

function getDefaultConfig(): IConfig {
  return Config.getDefault().get();
}

export function handler(_req: Request, res: Response): void {
  const result = getDefaultConfig();
  delete result.global.files; // unnecessary
  res.json(createSuccessResponse<IConfig>(result));
}
