const express = require('express');
const cors = require('cors');
require('dotenv').config();

const initDB = require('./config/initDB');
const lotteriesRoutes = require('./routes/lotteries');
const participantsRoutes = require('./routes/participants');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Инициализация БД
initDB();

// Роуты
app.use('/api/lotteries', lotteriesRoutes);
app.use('/api/participants', participantsRoutes);

// Проверка работы сервера
app.get('/', (req, res) => {
  res.json({ message: 'API сервиса розыгрышей работает!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});