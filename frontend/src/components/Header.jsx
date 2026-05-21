import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as VKID from '@vkid/sdk'; // Импортируем библиотеку VK ID
import './Header.css';

function Header({ vkUser, onLogin }) {
  
  // Получи свой APP_ID из кабинета VK ID
  const VK_APP_ID = 12345678; // ЗАМЕНИ НА СВОЙ ID ПРИЛОЖЕНИЯ!

  useEffect(() => {
    // Инициализируем VK ID один раз при загрузке компонента
    VKID.Config.init({
      app: VK_APP_ID,
      redirectUrl: 'http://localhost:3000/',
      state: 'random_state_string_123', // Просто случайная строка
    });

    // Находим контейнер для кнопки в вёрстке
    const container = document.getElementById('VkIdSdkOneTap');
    if (container) {
      const oneTap = new VKID.OneTap(); // Создаем "шторку" для быстрого входа
      oneTap.render({ container }); // Показываем её внутри контейнера
    }
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          🎁 Розыгрыши
        </Link>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/admin" className="nav-link">Админка</Link>
        </nav>
        <div className="header-user">
          {vkUser ? (
            <div className="user-info">
              <img src={vkUser.photo} alt="" className="user-avatar" />
              <span className="user-name">{vkUser.first_name}</span>
            </div>
          ) : (
            // Этот div станет кнопкой "Войти через VK"
            <div id="VkIdSdkOneTap"></div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;