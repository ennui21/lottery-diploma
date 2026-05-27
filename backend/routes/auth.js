const express = require('express');
const router = express.Router();
const { resolveScreenName, getUserInfo } = require('../services/vkApi');

router.post('/login', async (req, res) => {
  try {
    const { profile } = req.body;

    if (!profile) {
      return res.status(400).json({ error: 'Введите ссылку на профиль VK' });
    }

    let screenName = profile
      .replace(/https?:\/\/(vk\.com|vk\.ru)\//, '')
      .replace(/@/, '')
      .replace(/\/$/, '')
      .trim();

    let user = null;

    if (/^\d+$/.test(screenName)) {
      user = await getUserInfo(screenName);
    } else {
      const userId = await resolveScreenName(screenName);
      if (userId) {
        user = await getUserInfo(userId);
      }
    }

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден. Проверьте ссылку.' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;