import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ vkUser, onLogin, onLogout }) {
  const [profile, setProfile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!profile.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://diplom-esin.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });

      const data = await res.json();

      if (res.ok) {
        onLogin(data);
        setProfile('');
      } else {
        setError(data.error || 'Ошибка');
      }
    } catch (err) {
      setError('Нет связи с сервером');
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
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Ссылка VK или ID"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #D3D9E0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  width: '180px'
                }}
              />
              <button
                onClick={handleLogin}
                disabled={loading}
                style={{
                  background: '#4A7BFF',
                  color: '#FFFFFF',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {loading ? '...' : 'Войти'}
              </button>
              {error && <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;