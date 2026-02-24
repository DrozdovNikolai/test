// server/routes.ts
import { createServer } from "http";
import { Pool as Pool2 } from "pg";
import dotenv2 from "dotenv";

// server/products.ts
import { Router } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
var router = Router();
var pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5433"),
  database: process.env.DB_NAME || "profit_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  max: 20,
  idleTimeoutMillis: 3e4,
  connectionTimeoutMillis: 2e3
});
var products_default = router;

// server/routes.ts
import express from "express";

// server/auth.ts
import { timingSafeEqual } from "crypto";
function getBearerToken(authHeader) {
  if (!authHeader) return void 0;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match?.[1];
}
function safeEqual(a, b) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}
function requireAdminKey() {
  return (req, res, next) => {
    const adminKey = process.env.ADMIN_API_KEY;
    if (!adminKey) {
      if (process.env.NODE_ENV === "production") {
        return res.status(503).json({
          success: false,
          message: "ADMIN_API_KEY is not set (write endpoints disabled)"
        });
      }
      return next();
    }
    const providedKey = req.get("x-admin-key") || getBearerToken(req.get("authorization"));
    if (providedKey && safeEqual(providedKey, adminKey)) {
      return next();
    }
    return res.status(401).json({ success: false, message: "Unauthorized" });
  };
}

// server/routes.ts
dotenv2.config();
var pool2 = new Pool2({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5433"),
  database: process.env.DB_NAME || "profit_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  max: 20,
  idleTimeoutMillis: 3e4,
  connectionTimeoutMillis: 2e3
});
async function registerRoutes(app2) {
  app2.use(express.static("."));
  app2.get("/api/health", async (_req, res) => {
    try {
      await pool2.query("SELECT 1");
      res.json({
        success: true,
        status: "healthy",
        database: "connected",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        status: "unhealthy",
        database: "disconnected",
        error: error.message
      });
    }
  });
  app2.get("/api/products", async (req, res) => {
    try {
      const result = await pool2.query(`
        SELECT * FROM products 
        ORDER BY id ASC
      `);
      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
        success: false,
        message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u0434\u0430\u043D\u043D\u044B\u0445 \u0438\u0437 \u0431\u0430\u0437\u044B"
      });
    }
  });
  app2.use(products_default);
  app2.get("/api/products/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        const result2 = await pool2.query("SELECT * FROM products ORDER BY id ASC");
        return res.json({
          success: true,
          data: result2.rows,
          count: result2.rows.length
        });
      }
      const result = await pool2.query(
        `
        SELECT * FROM products 
        WHERE 
          title ILIKE $1 OR 
          description ILIKE $1 OR 
          short_description ILIKE $1 OR
          platform ILIKE $1
        ORDER BY id ASC
      `,
        [`%${q}%`]
      );
      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({
        success: false,
        message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u0438\u0441\u043A\u0435 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u043E\u0432"
      });
    }
  });
  app2.get("/api/products/stats", async (req, res) => {
    try {
      const [totalResult, certificatesResult, registeredResult, platformResult] = await Promise.all([
        pool2.query("SELECT COUNT(*) as count FROM products"),
        pool2.query("SELECT COUNT(*) as count FROM products WHERE certificate_image IS NOT NULL"),
        pool2.query("SELECT COUNT(*) as count FROM products WHERE registration_num IS NOT NULL"),
        pool2.query("SELECT platform, COUNT(*) as count FROM products GROUP BY platform")
      ]);
      const byPlatform = {};
      platformResult.rows.forEach((row) => {
        byPlatform[row.platform] = parseInt(row.count);
      });
      res.json({
        success: true,
        data: {
          total: parseInt(totalResult.rows[0].count),
          withCertificates: parseInt(certificatesResult.rows[0].count),
          registered: parseInt(registeredResult.rows[0].count),
          byPlatform
        }
      });
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({
        success: false,
        message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0438"
      });
    }
  });
  app2.get("/api/products/platform/:platform", async (req, res) => {
    try {
      const { platform } = req.params;
      const result = await pool2.query(
        "SELECT * FROM products WHERE platform ILIKE $1 ORDER BY id ASC",
        [`%${platform}%`]
      );
      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      console.error("Platform filter error:", error);
      res.status(500).json({
        success: false,
        message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0444\u0438\u043B\u044C\u0442\u0440\u0430\u0446\u0438\u0438 \u043F\u043E \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0435"
      });
    }
  });
  app2.get("/api/products/with-certificates", async (req, res) => {
    try {
      const result = await pool2.query(
        "SELECT * FROM products WHERE certificate_image IS NOT NULL ORDER BY id ASC"
      );
      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      console.error("Certificates error:", error);
      res.status(500).json({
        success: false,
        message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u043E\u0432 \u0441 \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u0430\u043C\u0438"
      });
    }
  });
  app2.get("/api/products/registered", async (req, res) => {
    try {
      const result = await pool2.query(
        "SELECT * FROM products WHERE registration_num IS NOT NULL ORDER BY id ASC"
      );
      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      console.error("Registered products error:", error);
      res.status(500).json({
        success: false,
        message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0445 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u043E\u0432"
      });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 ID \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0430"
        });
      }
      const result = await pool2.query("SELECT * FROM products WHERE id = $1", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "\u041F\u0440\u043E\u0434\u0443\u043A\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D"
        });
      }
      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
        success: false,
        message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0430"
      });
    }
  });
  app2.post("/api/products", requireAdminKey(), async (req, res) => {
    try {
      const productData = req.body;
      if (!productData.title || !productData.description || !productData.short_description || !productData.platform) {
        return res.status(400).json({
          success: false,
          message: "\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u0432\u0441\u0435 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043F\u043E\u043B\u044F: title, description, short_description, platform"
        });
      }
      const result = await pool2.query(
        `
        INSERT INTO products (
          title, description, short_description, 
          certificate_image, registration_num, 
          reg_program_num, platform
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *
      `,
        [
          productData.title,
          productData.description,
          productData.short_description,
          productData.certificate_image || null,
          productData.registration_num || null,
          productData.reg_program_num || null,
          productData.platform
        ]
      );
      res.status(201).json({
        success: true,
        data: result.rows[0],
        message: "\u041F\u0440\u043E\u0434\u0443\u043A\u0442 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0437\u0434\u0430\u043D"
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
        success: false,
        message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0430"
      });
    }
  });
  app2.put("/api/products/:id", requireAdminKey(), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 ID \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0430"
        });
      }
      const updateData = req.body;
      const existingProduct = await pool2.query("SELECT * FROM products WHERE id = $1", [id]);
      if (existingProduct.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "\u041F\u0440\u043E\u0434\u0443\u043A\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D"
        });
      }
      const fields = [];
      const values = [];
      let paramIndex = 1;
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== void 0) {
          fields.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });
      if (fields.length === 0) {
        return res.status(400).json({
          success: false,
          message: "\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F"
        });
      }
      values.push(id);
      const query = `
        UPDATE products 
        SET ${fields.join(", ")} 
        WHERE id = $${paramIndex} 
        RETURNING *
      `;
      const result = await pool2.query(query, values);
      res.json({
        success: true,
        data: result.rows[0],
        message: "\u041F\u0440\u043E\u0434\u0443\u043A\u0442 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D"
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
        success: false,
        message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0430"
      });
    }
  });
  app2.delete("/api/products/:id", requireAdminKey(), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 ID \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0430"
        });
      }
      const result = await pool2.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "\u041F\u0440\u043E\u0434\u0443\u043A\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D"
        });
      }
      res.json({
        success: true,
        message: "\u041F\u0440\u043E\u0434\u0443\u043A\u0442 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0434\u0430\u043B\u0435\u043D",
        data: result.rows[0]
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
        success: false,
        message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0430"
      });
    }
  });
  app2.get("/api/test-db", requireAdminKey(), async (_req, res) => {
    try {
      await pool2.query(`
        CREATE TABLE IF NOT EXISTS test_table (
          id SERIAL PRIMARY KEY,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await pool2.query("INSERT INTO test_table (message) VALUES ($1)", [
        "\u0422\u0435\u0441\u0442\u043E\u0432\u043E\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A PostgreSQL \u0443\u0441\u043F\u0435\u0448\u043D\u043E!"
      ]);
      const result = await pool2.query("SELECT * FROM test_table ORDER BY created_at DESC LIMIT 5");
      res.json({
        success: true,
        message: "\u0411\u0430\u0437\u0430 \u0434\u0430\u043D\u043D\u044B\u0445 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E",
        data: result.rows
      });
    } catch (error) {
      console.error("Test DB error:", error);
      res.status(500).json({
        success: false,
        message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0440\u0430\u0431\u043E\u0442\u0435 \u0441 \u0431\u0430\u0437\u043E\u0439 \u0434\u0430\u043D\u043D\u044B\u0445",
        error: error.message
      });
    }
  });
  app2.post("/api/init-db", requireAdminKey(), async (_req, res) => {
    try {
      await pool2.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          short_description VARCHAR(500),
          certificate_image VARCHAR(255),
          registration_num VARCHAR(100),
          reg_program_num VARCHAR(100),
          platform VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      res.json({
        success: true,
        message: "\u0411\u0430\u0437\u0430 \u0434\u0430\u043D\u043D\u044B\u0445 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u0430"
      });
    } catch (error) {
      console.error("Init DB error:", error);
      res.status(500).json({
        success: false,
        message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438 \u0431\u0430\u0437\u044B \u0434\u0430\u043D\u043D\u044B\u0445",
        error: error.message
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs from "fs";
import path from "path";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const vitePkg = "vite";
  const { createServer: createViteServer, createLogger } = await import(vitePkg);
  const nanoidPkg = "nanoid";
  const { nanoid } = await import(nanoidPkg);
  const viteConfigPath = "../vite.config";
  const { default: viteConfig } = await import(viteConfigPath);
  const viteLogger = createLogger();
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  const basePath = process.env.PUBLIC_BASE_PATH || "/";
  const basePathNoTrailingSlash = basePath === "/" ? "" : basePath.replace(/\/$/, "");
  const mountPath = basePathNoTrailingSlash || "/";
  app2.use(mountPath, express2.static(distPath));
  app2.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    if (basePathNoTrailingSlash && !req.path.startsWith(basePathNoTrailingSlash)) {
      const originalUrl = req.originalUrl.startsWith("/") ? req.originalUrl : `/${req.originalUrl}`;
      return res.redirect(302, `${basePathNoTrailingSlash}${originalUrl}`);
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// server/app.ts
import cors from "cors";
import dotenv3 from "dotenv";
import express3 from "express";
dotenv3.config();
function createApp() {
  const app2 = express3();
  app2.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true
    })
  );
  app2.use(express3.json());
  app2.use(express3.urlencoded({ extended: false }));
  app2.use((req, res, next) => {
    const start = Date.now();
    const path2 = req.path;
    let capturedJsonResponse = void 0;
    const originalResJson = res.json;
    res.json = function(bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };
    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path2.startsWith("/api")) {
        let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }
        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "\u2026";
        }
        log(logLine);
      }
    });
    next();
  });
  return app2;
}
function registerErrorHandler(app2) {
  app2.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Server error:", err);
    res.status(status).json({
      success: false,
      message,
      ...process.env.NODE_ENV === "development" && { stack: err.stack }
    });
  });
}

// server/index.ts
var app = createApp();
(async () => {
  try {
    const server = await registerRoutes(app);
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    registerErrorHandler(app);
    const port = parseInt(process.env.PORT || "3000", 10);
    server.listen(port, () => {
      console.log(`\u{1F680} \u0421\u0435\u0440\u0432\u0435\u0440 \u0437\u0430\u043F\u0443\u0449\u0435\u043D \u043D\u0430 http://localhost:${port}`);
      console.log(`\u{1F4CA} API \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u043E\u0432: http://localhost:${port}/api/products`);
      console.log(`\u{1F50D} Health check: http://localhost:${port}/api/health`);
      console.log(`\u{1F504} \u0418\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u0411\u0414: http://localhost:${port}/api/init-db (POST)`);
    });
  } catch (error) {
    console.error("\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u043F\u0443\u0441\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430:", error);
    process.exit(1);
  }
})();
