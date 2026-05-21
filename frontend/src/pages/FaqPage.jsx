import React from 'react';
import './FaqPage.css';

function FaqPage() {
  return (
    <div className="info-page">
      <h1>FAQ</h1>
      <div className="info-card">
        <h3>Как участвовать?</h3>
        <p>Войдите через VK, выберите активный розыгрыш и нажмите «Участвовать».</p>
        <h3>Как выбирается победитель?</h3>
        <p>Случайным образом среди всех участников.</p>
        <h3>Сколько раз можно участвовать?</h3>
        <p>Один раз в одном розыгрыше.</p>
      </div>
    </div>
  );
}

export default FaqPage;