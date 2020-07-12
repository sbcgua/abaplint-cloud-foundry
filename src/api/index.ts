import * as express from "express";
import { checkObject } from "./check_object";
import { getDefaultConfig } from "./lint_config";
import { addInfoEx } from "../lib/log-tail";
import {
  createErrorResponse,
  createSuccessStringResponse,
  createSuccessResponse,
} from "./api-types";

const router = express.Router();

router.use(express.json({limit: "50mb"}));
router.use(express.urlencoded({limit: "50mb", extended: false}));

router.get("/ping", (_req, res) => {
  addInfoEx("ping");
  res.json(createSuccessStringResponse("abap is forevah!"));
});

router.get("/default_config", (_,res) => {
  const defaultConfig = getDefaultConfig();
  res.json(createSuccessResponse(defaultConfig));
});

router.post("/check_file", (req, res) => {
  // TODO validate request
  let hrstart, result, hrend;
  try {
    hrstart = process.hrtime();
    result = checkObject(req.body);
    hrend = process.hrtime(hrstart);
  } catch (err) {
    err.message = "[abaplint] " + err.message;
    throw err;
  }

  addInfoEx([
    "check_file",
    result.object.objectType,
    result.object.objectName,
    `${result.issues.length} issues`,
    `${req.socket.bytesRead} bytes`,
    `${(hrend[0] * 1000 + hrend[1] / 1000000).toFixed()} ms`,
  ]);
  res.json(createSuccessResponse(result));
});

// app.post("/api/v1/check_configuration",
// app.post("/api/v1/pretty_print",

router.all("*", (req, res) => {
  addInfoEx("unexpected API call: " + req.originalUrl);
  res.status(404).json(createErrorResponse("Wrong API call"));
});

router.use((err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).json(createErrorResponse(err.message));
  next(err);
});

export default router;
