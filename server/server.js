const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 🔥 Раздача статических файлов (картинок) из папки public клиента
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

// --- 1. Конфигурация Swagger ---
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Интернет-Магазина',
      version: '1.0.0',
      description: 'Документация для CRUD операций товаров и пользователей',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      schemas: {
        // Схема пользователя (по заданию)
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'admin' },
            email: { type: 'string', example: 'admin@shop.com' },
            role: { type: 'string', example: 'manager' }
          }
        },
        // Схема товара
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            category: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'integer' },
            image: { type: 'string', example: '/images/phone.jpg' }
          }
        }
      }
    }
  },
  apis: ['./server.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- 2. База данных (10 товаров) ---
let products = [
  { 
    id: 1, 
    name: 'Смартфон X', 
    category: 'Телефоны', 
    description: 'Мощный смартфон с хорошей камерой', 
    price: 50000, 
    stock: 10,
    image: '/images/phone.jpg' 
  },
  { 
    id: 2, 
    name: 'Ноутбук Pro', 
    category: 'Компьютеры', 
    description: 'Для работы и игр', 
    price: 120000, 
    stock: 5,
    image: '/images/laptop.jpg'
  },
  { 
    id: 3, 
    name: 'Наушники Air', 
    category: 'Аудио', 
    description: 'Беспроводные наушники', 
    price: 15000, 
    stock: 20,
    image: '/images/headphones.jpg'
  },
  { 
    id: 4, 
    name: 'Часы Smart', 
    category: 'Гаджеты', 
    description: 'Фитнес-трекер', 
    price: 10000, 
    stock: 15,
    image: '/images/watch.jpg'
  },
  { 
    id: 5, 
    name: 'Камера 4K', 
    category: 'Фото', 
    description: 'Профессиональная камера', 
    price: 80000, 
    stock: 3,
    image: '/images/camera.jpg'
  },
  { 
    id: 6, 
    name: 'Планшет Mini', 
    category: 'Планшеты', 
    description: 'Компактный планшет', 
    price: 30000, 
    stock: 8,
    image: '/images/tablet.jpg'
  },
  { 
    id: 7, 
    name: 'Монитор 27"', 
    category: 'Компьютеры', 
    description: 'IPS матрица', 
    price: 25000, 
    stock: 12,
    image: '/images/monitor.jpg'
  },
  { 
    id: 8, 
    name: 'Клавиатура Mech', 
    category: 'Аксессуары', 
    description: 'RGB подсветка', 
    price: 8000, 
    stock: 25,
    image: '/images/keyboard.jpg'
  },
  { 
    id: 9, 
    name: 'Мышь Gaming', 
    category: 'Аксессуары', 
    description: 'Высокий DPI', 
    price: 5000, 
    stock: 30,
    image: '/images/mouse.jpg'
  },
  { 
    id: 10, 
    name: 'Колонка Bass', 
    category: 'Аудио', 
    description: 'Мощный звук', 
    price: 12000, 
    stock: 18,
    image: '/images/speaker.jpg'
  },
];

// --- 3. CRUD Операции с JSDoc аннотациями ---

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить все товары
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200:
 *         description: Данные товара
 */
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send('Товар не найден');
  res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Добавить новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Product' }
 *     responses:
 *       201:
 *         description: Товар создан
 */
app.post('/api/products', (req, res) => {
  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    ...req.body
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Редактировать товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Product' }
 *     responses:
 *       200:
 *         description: Товар обновлен
 */
app.patch('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send('Товар не найден');
  Object.assign(product, req.body);
  res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Товар удален
 */
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Товар не найден');
  products.splice(index, 1);
  res.json({ message: 'Товар удален' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
  console.log(`📚 Swagger документация: http://localhost:${PORT}/api-docs`);
  console.log(`🖼️  Картинки: http://localhost:${PORT}/images/phone.jpg`);
});