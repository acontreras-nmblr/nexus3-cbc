import { Router } from "express";

export const healthcheckRouter = Router();

healthcheckRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
