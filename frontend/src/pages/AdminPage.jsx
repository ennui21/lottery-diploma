import React, { useState, useEffect } from 'react';
import './AdminPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AdminPage() {
  const [lotteries, setLotteries] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prize, setPrize] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLotteries();
  }, []);

  const fetchLotteries = async () => {
    try {
      const res = await fetch(`${API_URL}/lotteries`);
      const data = await res.json();
      setLotteries(data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/lotteries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, prize, end_date: endDate })
      });

      if (res.ok) {
        setMessage('✅ Розыгрыш создан!');
        setTitle('');
        setDescription('');
        setPrize('');
        setEndDate('');
        fetchLotteries();
      } else {
        const data = await res.json();
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Ошибка соединения');
    }
  };

  const handleSelectWinner = async (id) => {
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/lotteries/${id}/select-winner`, {
        method: 'POST'
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`🎉 Победитель выбран! ID: ${data.winner.vk_user_id}`);
        fetchLotteries();
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Ошибка соединения');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Админ-панель</h1>

      <div className="admin-card">
        <h2 className="card-title">Создать новый розыгрыш</h2>
        <form onSubmit={handleCreate} className="admin-form">
          <input
            type="text"
            placeholder="Название розыгрыша"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="admin-input"
          />
          <input
            type="text"
            placeholder="Описание (необязательно)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="admin-input"
          />
          <input
            type="text"
            placeholder="Приз"
            value={prize}
            onChange={(e) => setPrize(e.target.value)}
            required
            className="admin-input"
          />
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="admin-input"
          />
          <button type="submit" className="btn-create">Создать розыгрыш</button>
        </form>
      </div>

      {message && <p className="admin-message">{message}</p>}

      <div className="admin-card">
        <h2 className="card-title">Управление розыгрышами</h2>
        {lotteries.length === 0 ? (
          <p className="empty-text">Розыгрышей пока нет</p>
        ) : (
          <div className="admin-list">
            {lotteries.map((lottery) => (
              <div key={lottery.id} className="admin-item">
                <div className="admin-item-info">
                  <span className="admin-item-title">{lottery.title}</span>
                  <span className="admin-item-prize">{lottery.prize}</span>
                  <span className="admin-item-date">до {formatDate(lottery.end_date)}</span>
                  <span className={`admin-item-status status-${lottery.status}`}>
                    {lottery.status === 'active' ? 'Активен' : 'Завершён'}
                  </span>
                  {lottery.winner_id && (
                    <span className="admin-item-winner">Победитель: {lottery.winner_id}</span>
                  )}
                </div>
                {lottery.status === 'active' && (
                  <button
                    className="btn-winner"
                    onClick={() => handleSelectWinner(lottery.id)}
                  >
                    Выбрать победителя
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;