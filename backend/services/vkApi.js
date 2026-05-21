const fetch = require('node-fetch');
require('dotenv').config();

const VK_SERVICE_KEY = process.env.VK_SERVICE_KEY;
const VK_API_VERSION = '5.199';

// Получение ID пользователя по короткому имени или ссылке
const resolveScreenName = async (screenName) => {
  try {
    const url = `https://api.vk.com/method/utils.resolveScreenName?screen_name=${screenName}&access_token=${VK_SERVICE_KEY}&v=${VK_API_VERSION}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error || !data.response || data.response.type !== 'user') {
      return null;
    }

    return data.response.object_id;
  } catch (error) {
    console.error('Ошибка получения ID:', error.message);
    return null;
  }
};

// Получение данных пользователя по ID
const getUserInfo = async (userId) => {
  try {
    const url = `https://api.vk.com/method/users.get?user_ids=${userId}&fields=photo_100&access_token=${VK_SERVICE_KEY}&v=${VK_API_VERSION}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error || !data.response || data.response.length === 0) {
      return null;
    }

    const user = data.response[0];
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      photo: user.photo_100
    };
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error.message);
    return null;
  }
};

// Проверка, подписан ли пользователь на сообщество
const checkIsMember = async (vkUserId) => {
  try {
    const url = `https://api.vk.com/method/groups.isMember?group_id=${process.env.VK_GROUP_ID}&user_id=${vkUserId}&access_token=${VK_SERVICE_KEY}&v=${VK_API_VERSION}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('VK API error:', data.error);
      return false;
    }

    return data.response === 1;
  } catch (error) {
    console.error('Ошибка проверки подписки:', error.message);
    return false;
  }
};

module.exports = { resolveScreenName, getUserInfo, checkIsMember };