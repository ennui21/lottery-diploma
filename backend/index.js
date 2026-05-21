const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const initDB = require('./config/initDB');
const lotteriesRoutes = require('./routes/lotteries');
const participantsRoutes = require('./routes/participants');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

initDB();

app.use('/api/lotteries', lotteriesRoutes);
app.use('/api/participants', participantsRoutes);

// ========== VK OAuth (классический метод, работает без ИНН) ==========
const REDIRECT_URI = 'https://diplom-esin-dzh7lsz1f-no-one-needs-youu-s-projects.vercel.app/auth/callback';

// Шаг 1: Направляем пользователя на старую страницу авторизации VK
app.get('/api/auth/vk', (req, res) => {
  const vkAuthUrl = 'https://oauth.vk.com/authorize' +
    `?client_id=${process.env.VK_APP_ID}` +
    `&redirect_uri=${REDIRECT_URI}` +
    '&response_type=code' +
    '&scope=users.get' +
    '&v=5.199' +
    '&state=random123';
  res.redirect(vkAuthUrl);
});

// Шаг 2: VK возвращает code, обмениваем его на токен (без client_secret!)
app.get('/api/auth/vk/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Код авторизации не получен' });
  }

  try {
    // Обмениваем code на access_token. Этот метод работает без client_secret.
    const tokenUrl = 'https://oauth.vk.com/access_token' +
      `?client_id=${process.env.VK_APP_ID}` +
      `&client_secret=${process.env.VK_CLIENT_SECRET}` +
      `&redirect_uri=${REDIRECT_URI}` +
      `&code=${code}`;

    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description || 'Ошибка получения токена' });
    }

    // Получаем данные пользователя
    const userUrl = 'https://api.vk.com/method/users.get' +
      `?user_ids=${tokenData.user_id}` +
      `&fields=photo_100` +
      `&access_token=${tokenData.access_token}` +
      `&v=5.199`;

    const userResponse = await fetch(userUrl);
    const userData = await userResponse.json();

    if (userData.error || !userData.response) {
      return res.status(400).json({ error: 'Ошибка получения данных пользователя' });
    }

    const user = userData.response[0];

    // Отправляем данные обратно на фронтенд
    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage(
              ${JSON.stringify({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                photo: user.photo_100
              })},
              '*'
            );
            window.close();
          </script>
          <p>Авторизация успешна! Окно можно закрыть.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'API сервиса розыгрышей работает!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});