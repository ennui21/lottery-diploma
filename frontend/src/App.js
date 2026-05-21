import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LotteryDetail from './pages/LotteryDetail';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  const [vkUser, setVkUser] = useState(null);

  const handleVKLogin = () => {
    const vkUserId = prompt('Введите ваш VK ID (для теста, потом заменим на VK ID Auth):');
    if (vkUserId) {
      setVkUser({
        id: parseInt(vkUserId),
        first_name: 'Пользователь',
        last_name: `#${vkUserId}`,
        photo: 'https://vk.com/images/camera_100.png'
      });
    }
  };

  return (
    <Router>
      <Header vkUser={vkUser} onLogin={handleVKLogin} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lottery/:id" element={<LotteryDetail vkUser={vkUser} />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;