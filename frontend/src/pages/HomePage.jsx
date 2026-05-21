import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function HomePage() {
  const [lotteries, setLotteries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLotteries();
  }, []);

  const fetchLotteries = async () => {
    try {
      const res = await fetch(`${API_URL}/lotteries`);
      const data = await res.json();
      setLotteries(data);
    } catch (error) {
      console.error('Ошибка загрузки розыгрышей:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Активен' : 'Завершён';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="home-page">
      <div className="page-header">
        <h1 className="page-title">Активные розыгрыши</h1>
        <p className="page-subtitle">Участвуйте и выигрывайте призы!</p>
      </div>

      {lotteries.length === 0 ? (
        <div className="empty-state">
          <p>Пока нет активных розыгрышей</p>
          <p className="empty-sub">Загляните позже или создайте новый в админке</p>
        </div>
      ) : (
        <div className="lottery-grid">
          {lotteries.map((lottery) => (
            <Link to={`/lottery/${lottery.id}`} key={lottery.id} className="lottery-card">
              <div className="card-badge" data-status={lottery.status}>
                {getStatusText(lottery.status)}
              </div>
              <h3 className="card-title">{lottery.title}</h3>
              <p className="card-prize">🏆 {lottery.prize}</p>
              {lottery.description && (
                <p className="card-desc">{lottery.description}</p>
              )}
              <div className="card-footer">
                <span className="card-date">До {formatDate(lottery.end_date)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;