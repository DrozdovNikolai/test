require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Настройка подключения к PostgreSQL
const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'profit_db',
  password: process.env.PG_PASSWORD || 'postgres',
  port: process.env.PG_PORT || 5433,
});

// Проверка подключения
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release();
  }
});

// API эндпоинты
app.get('/api/products', async (req, res) => {
  try {
    console.log('Fetching products from database...');
    const result = await pool.query(
      'SELECT * FROM products ORDER BY id ASC'
    );
    console.log(`Found ${result.rows.length} products`);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { title, short_description, platform, registration_num, reg_program_num, certificate_image, description } = req.body;
    
    const result = await pool.query(
      `INSERT INTO products (title, short_description, platform, registration_num, reg_program_num, certificate_image, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, short_description, platform, registration_num, reg_program_num, certificate_image, description]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Обновленная таблица в PostgreSQL
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📊 API available at http://localhost:${port}/api/products`);
});
