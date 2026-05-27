import React, { useState, useEffect } from 'react';
import './WinnersPage.css';

const API_URL = 'https://lottery-diploma.onrender.com/api';

function WinnersPage() {
  const [lotteries, setLotteries] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/lotteries`)
      .then(r => r.json())
      .then(async (data) => {
        const finished = data.filter(l => l.status === 'finished');
        // Для каждого завершённого розыгрыша получаем инфу о победителе
        const withWinners = await Promise.all(
          finished.map(async (l) => {
            if (l.winner_id) {
              try {
                const res = await fetch(`${API_URL}/participants/winner/${l.winner_id}`);
                const winner = await res.json();
                return { ...l, winner: winner };
              } catch (e) {
                return l;
              }
            }
            return l;
          })
        );
        setLotteries(withWinners);
      })
      .catch(console.error);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="info-page">
      <h1>🏆 Победители</h1>
      {lotteries.length === 0 ? (
        <p className="empty-text">Завершённых розыгрышей пока нет</p>
      ) : (
        <div className="winners-list">
          {lotteries.map(l => (
            <div key={l.id} className="winner-card">
              <h3>{l.title}</h3>
              <p>Приз: {l.prize}</p>
              <p>Завершён: {formatDate(l.end_date)}</p>
              {l.winner && l.winner.first_name ? (
                <div className="winner-card-user">
                  <img src={l.winner.photo || 'https://vk.com/images/camera_100.png'} alt="" className="winner-card-avatar" />
                  <span>{l.winner.first_name} {l.winner.last_name}</span>
                </div>
              ) : (
                <p>Победитель: ID {l.winner_id}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WinnersPage;