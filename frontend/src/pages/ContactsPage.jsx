import React from 'react';
import './ContactsPage.css';

function ContactsPage() {
  return (
    <div className="info-page">
      <h1>Контакты</h1>
      <div className="info-card">
        <p>📧 Email: example@vk.com</p>
        <p>💬 ВКонтакте: vk.com/volgr</p>
      </div>
    </div>
  );
}

export default ContactsPage;