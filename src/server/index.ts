import "dotenv/config";
import { createServer } from "./entrypoints/rest/server.js";
import { config } from "./config.js";
import { logger } from "./utilities/logger.js";

const start = async () => {
  const app = createServer();

  app.listen(config.server.port, config.server.host, () => {
    logger.info(
      `Server running at http://${config.server.host}:${config.server.port}`
    );
  });
};

start().catch((err) => {
  logger.error("Failed to start server", err);
  process.exit(1);
});
