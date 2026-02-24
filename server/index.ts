import fs from "node:fs";
import { createServer as createHttpServer, type Server as HttpServer } from "node:http";
import { createServer as createHttpsServer, type ServerOptions as HttpsServerOptions, type Server as HttpsServer } from "node:https";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { createApp, registerErrorHandler } from "./app";

const app = createApp();
type AppServer = HttpServer | HttpsServer;
type ServerProtocol = "http" | "https";

function isEnabled(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function readTlsFile(envName: "TLS_KEY_PATH" | "TLS_CERT_PATH" | "TLS_CA_PATH"): Buffer {
  const filePath = process.env[envName];
  if (!filePath) {
    throw new Error(`TLS включен, но не задана переменная окружения ${envName}`);
  }

  try {
    return fs.readFileSync(filePath);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Не удалось прочитать ${envName} (${filePath}): ${reason}`);
  }
}

function createProductionServer(): { server: AppServer; protocol: ServerProtocol } {
  const tlsEnabled = isEnabled(process.env.TLS_ENABLED);
  if (!tlsEnabled) {
    return { server: createHttpServer(app), protocol: "http" };
  }

  const options: HttpsServerOptions = {
    key: readTlsFile("TLS_KEY_PATH"),
    cert: readTlsFile("TLS_CERT_PATH"),
    minVersion: "TLSv1.2",
  };

  if (process.env.TLS_CA_PATH) {
    options.ca = readTlsFile("TLS_CA_PATH");
  }

  if (process.env.TLS_PASSPHRASE) {
    options.passphrase = process.env.TLS_PASSPHRASE;
  }

  return { server: createHttpsServer(options, app), protocol: "https" };
}

(async () => {
  try {
    await registerRoutes(app);
    let server: AppServer;
    let protocol: ServerProtocol;

    if (app.get("env") === "development") {
      server = createHttpServer(app);
      protocol = "http";
      await setupVite(app, server);
    } else {
      serveStatic(app);
      ({ server, protocol } = createProductionServer());
    }

    registerErrorHandler(app);

    const port = parseInt(process.env.PORT || "3000", 10);
    const publicPort = process.env.APP_PORT || String(port);

    server.listen(port, () => {
      console.log(`🚀 Сервер запущен на ${protocol}://localhost:${publicPort}`);
      console.log(`📊 API продуктов: ${protocol}://localhost:${publicPort}/api/products`);
      console.log(`🔍 Health check: ${protocol}://localhost:${publicPort}/api/health`);
      console.log(`🔄 Инициализация БД: ${protocol}://localhost:${publicPort}/api/init-db (POST)`);
    });

  } catch (error) {
    console.error("❌ Ошибка запуска сервера:", error);
    process.exit(1);
  }
})();
