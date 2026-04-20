import { createServer } from "node:http";

import { createApp } from "./app.js";
import { loadConfig } from "./config/env.js";

const config = loadConfig();
const app = createApp(config);
const server = createServer(app);

server.listen(config.port, () => {
  console.log(
    `rag-server listening on http://localhost:${config.port} (log level: ${config.logLevel})`,
  );
});

function shutdown(signal: NodeJS.Signals) {
  console.log(`Received ${signal}, shutting down rag-server.`);
  server.close((error) => {
    if (error) {
      console.error("Failed to close server cleanly.", error);
      process.exitCode = 1;
      return;
    }

    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);