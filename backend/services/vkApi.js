const fetch = require('node-fetch');
require('dotenv').config();

const VK_SERVICE_KEY = process.env.VK_SERVICE_KEY;
const VK_GROUP_ID = process.env.VK_GROUP_ID;
const VK_API_VERSION = '5.199';

// Проверка, подписан ли пользователь на сообщество
const checkIsMember = async (vkUserId) => {
  try {
    const url = `https://api.vk.com/method/groups.isMember?group_id=${VK_GROUP_ID}&user_id=${vkUserId}&access_token=${VK_SERVICE_KEY}&v=${VK_API_VERSION}`;
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

// Получение данных пользователя
const getUserInfo = async (vkUserId) => {
  try {
    const url = `https://api.vk.com/method/users.get?user_ids=${vkUserId}&fields=photo_100&access_token=${VK_SERVICE_KEY}&v=${VK_API_VERSION}`;
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

module.exports = { checkIsMember, getUserInfo };