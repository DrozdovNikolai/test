import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { Pool } from "pg";
import dotenv from "dotenv";
import productsRouter from "../server/products"; // Исправленный путь
import express from 'express'; // Добавьте этот импорт
import path from 'path';
import { requireAdminKey } from "./auth";

dotenv.config();

// Подключение к PostgreSQL
export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5433"),
  database: process.env.DB_NAME || "profit_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Типы данных
interface Product {
  id: number;
  title: string;
  description: string;
  short_description: string;
  certificate_image: string | null;
  registration_num: string | null;
  reg_program_num: string | null;
  platform: string;
  created_at: Date;
}

interface CreateProductDTO {
  title: string;
  description: string;
  short_description: string;
  certificate_image?: string;
  registration_num?: string;
  reg_program_num?: string;
  platform: string;
}

interface UpdateProductDTO {
  title?: string;
  description?: string;
  short_description?: string;
  certificate_image?: string;
  registration_num?: string;
  reg_program_num?: string;
  platform?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Простой вариант - относительные пути
  app.use(express.static('.'));


  // Health check
  app.get("/api/health", async (_req: Request, res: Response) => {
    try {
      await pool.query("SELECT 1");
      res.json({
        success: true,
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        status: "unhealthy",
        database: "disconnected",
        error: (error as Error).message,
      });
    }
  });

  // Получить все продукты
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const result = await pool.query<Product>(`
        SELECT * FROM products 
        ORDER BY id ASC
      `);
      
      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length,
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
        success: false,
        message: "Ошибка при получении данных из базы",
      });
    }
  });
  app.use(productsRouter);
  // Поиск продуктов
  app.get("/api/products/search", async (req: Request, res: Response) => {
    try {
      const { q } = req.query;

      if (!q || typeof q !== "string") {
        const result = await pool.query<Product>("SELECT * FROM products ORDER BY id ASC");
        return res.json({
          success: true,
          data: result.rows,
          count: result.rows.length,
        });
      }

      const result = await pool.query<Product>(
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
        count: result.rows.length,
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({
        success: false,
        message: "Ошибка при поиске продуктов",
      });
    }
  });

  // Получить статистику продуктов
  app.get("/api/products/stats", async (req: Request, res: Response) => {
    try {
      const [totalResult, certificatesResult, registeredResult, platformResult] = await Promise.all([
        pool.query("SELECT COUNT(*) as count FROM products"),
        pool.query("SELECT COUNT(*) as count FROM products WHERE certificate_image IS NOT NULL"),
        pool.query("SELECT COUNT(*) as count FROM products WHERE registration_num IS NOT NULL"),
        pool.query("SELECT platform, COUNT(*) as count FROM products GROUP BY platform"),
      ]);

      const byPlatform: Record<string, number> = {};
      platformResult.rows.forEach((row: any) => {
        byPlatform[row.platform] = parseInt(row.count);
      });

      res.json({
        success: true,
        data: {
          total: parseInt(totalResult.rows[0].count),
          withCertificates: parseInt(certificatesResult.rows[0].count),
          registered: parseInt(registeredResult.rows[0].count),
          byPlatform,
        },
      });
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({
        success: false,
        message: "Ошибка при получении статистики",
      });
    }
  });

  // Дополнительные маршруты для работы с таблицей products
  app.get("/api/products/platform/:platform", async (req: Request, res: Response) => {
    try {
      const { platform } = req.params;
      const result = await pool.query<Product>(
        "SELECT * FROM products WHERE platform ILIKE $1 ORDER BY id ASC",
        [`%${platform}%`]
      );

      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length,
      });
    } catch (error) {
      console.error("Platform filter error:", error);
      res.status(500).json({
        success: false,
        message: "Ошибка при фильтрации по платформе",
      });
    }
  });

  // Получить продукты с сертификатами
  app.get("/api/products/with-certificates", async (req: Request, res: Response) => {
    try {
      const result = await pool.query<Product>(
        "SELECT * FROM products WHERE certificate_image IS NOT NULL ORDER BY id ASC"
      );

      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length,
      });
    } catch (error) {
      console.error("Certificates error:", error);
      res.status(500).json({
        success: false,
        message: "Ошибка при получении продуктов с сертификатами",
      });
    }
  });

  // Получить зарегистрированные продукты
  app.get("/api/products/registered", async (req: Request, res: Response) => {
    try {
      const result = await pool.query<Product>(
        "SELECT * FROM products WHERE registration_num IS NOT NULL ORDER BY id ASC"
      );

      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length,
      });
    } catch (error) {
      console.error("Registered products error:", error);
      res.status(500).json({
        success: false,
        message: "Ошибка при получении зарегистрированных продуктов",
      });
    }
  });

  // Получить продукт по ID
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Неверный ID продукта",
        });
      }

      const result = await pool.query<Product>("SELECT * FROM products WHERE id = $1", [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Продукт не найден",
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
        success: false,
        message: "Ошибка при получении продукта",
      });
    }
  });

  // Создать продукт
  app.post("/api/products", requireAdminKey(), async (req: Request, res: Response) => {
    try {
      const productData: CreateProductDTO = req.body;

      // Валидация
      if (!productData.title || !productData.description || !productData.short_description || !productData.platform) {
        return res.status(400).json({
          success: false,
          message: "Заполните все обязательные поля: title, description, short_description, platform",
        });
      }

      const result = await pool.query<Product>(
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
          productData.platform,
        ]
      );

      res.status(201).json({
        success: true,
        data: result.rows[0],
        message: "Продукт успешно создан",
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
        success: false,
        message: "Ошибка при создании продукта",
      });
    }
  });

  // Обновить продукт
  app.put("/api/products/:id", requireAdminKey(), async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Неверный ID продукта",
        });
      }

      const updateData: UpdateProductDTO = req.body;

      // Проверка существования продукта
      const existingProduct = await pool.query<Product>("SELECT * FROM products WHERE id = $1", [id]);
      if (existingProduct.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Продукт не найден",
        });
      }

      // Формирование запроса на обновление
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          fields.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });

      if (fields.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Нет данных для обновления",
        });
      }

      values.push(id);

      const query = `
        UPDATE products 
        SET ${fields.join(", ")} 
        WHERE id = $${paramIndex} 
        RETURNING *
      `;

      const result = await pool.query<Product>(query, values);

      res.json({
        success: true,
        data: result.rows[0],
        message: "Продукт успешно обновлен",
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
        success: false,
        message: "Ошибка при обновлении продукта",
      });
    }
  });

  // Удалить продукт
  app.delete("/api/products/:id", requireAdminKey(), async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Неверный ID продукта",
        });
      }

      const result = await pool.query<Product>("DELETE FROM products WHERE id = $1 RETURNING *", [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Продукт не найден",
        });
      }

      res.json({
        success: true,
        message: "Продукт успешно удален",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
        success: false,
        message: "Ошибка при удалении продукта",
      });
    }
  });

  // Тестовый маршрут для проверки работы базы данных
  app.get("/api/test-db", requireAdminKey(), async (_req: Request, res: Response) => {
    try {
      // Создаем тестовую таблицу, если она не существует
      await pool.query(`
        CREATE TABLE IF NOT EXISTS test_table (
          id SERIAL PRIMARY KEY,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Вставляем тестовые данные
      await pool.query("INSERT INTO test_table (message) VALUES ($1)", [
        "Тестовое подключение к PostgreSQL успешно!",
      ]);

      // Получаем данные
      const result = await pool.query("SELECT * FROM test_table ORDER BY created_at DESC LIMIT 5");

      res.json({
        success: true,
        message: "База данных работает корректно",
        data: result.rows,
      });
    } catch (error) {
      console.error("Test DB error:", error);
      res.status(500).json({
        success: false,
        message: "Ошибка при работе с базой данных",
        error: (error as Error).message,
      });
    }
  });

  // Инициализация базы данных (для разработки)
  app.post("/api/init-db", requireAdminKey(), async (_req: Request, res: Response) => {
    try {
      // Создаем таблицу products, если она не существует
      await pool.query(`
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
        message: "База данных успешно инициализирована",
        
      });
    } catch (error) {
      console.error("Init DB error:", error);
      res.status(500).json({
        success: false,
        message: "Ошибка при инициализации базы данных",
        error: (error as Error).message,
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
