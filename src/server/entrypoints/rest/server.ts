import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { healthcheckRouter } from "./controllers/healthcheck.js";
import { authRouter } from "./controllers/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createServer = () => {
  const app = express();

  // Security
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.use("/api", healthcheckRouter);
  app.use("/api", authRouter);

  // Serve frontend static files in production
  if (process.env.NODE_ENV === "production") {
    const clientDir = path.resolve(__dirname, "../../../client");
    app.use(express.static(clientDir));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(clientDir, "index.html"));
    });
  }

  return app;
};
