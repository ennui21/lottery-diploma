import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const API_URL = 'https://diplom-esin.onrender.com/api';

function Header({ vkUser, onLogin, onLogout }) {
  const [showLogin, setShowLogin] = useState(false);
  const [profile, setProfile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!profile.trim()) {
      setError('Введите ссылку на профиль');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });

      const data = await res.json();

      if (res.ok) {
        onLogin(data);
        setShowLogin(false);
        setProfile('');
      } else {
        setError(data.error || 'Ошибка входа');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">🎁 Розыгрыши</Link>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/admin" className="nav-link">Админка</Link>
        </nav>
        <div className="header-user">
          {vkUser ? (
            <div className="user-info">
              <img src={vkUser.photo} alt="" className="user-avatar" />
              <span className="user-name">{vkUser.first_name}</span>
              <button className="btn-logout" onClick={onLogout}>Выйти</button>
            </div>
          ) : (
            <button className="btn-login" onClick={() => setShowLogin(!showLogin)}>
              Войти через VK
            </button>
          )}
        </div>
      </div>

            {showLogin && (
        <div className="login-modal" onClick={() => setShowLogin(false)}>
          <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Вход через VK</h3>
            <p>Введите ссылку на ваш профиль, имя или ID:</p>
            <input
              type="text"
              placeholder="vk.com/volgr или volgr"
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="login-input"
              autoFocus
            />
            {error && <p className="login-error">{error}</p>}
            <div className="login-buttons">
              <button onClick={handleLogin} disabled={loading} className="btn-login-submit">
                {loading ? 'Вход...' : 'Войти'}
              </button>
              <button onClick={() => { setShowLogin(false); setError(''); }} className="btn-login-cancel">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;