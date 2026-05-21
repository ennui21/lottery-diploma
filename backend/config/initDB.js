const pool = require('./database');

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lotteries (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        prize VARCHAR(255) NOT NULL,
        end_date TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        winner_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS participants (
        id SERIAL PRIMARY KEY,
        lottery_id INTEGER REFERENCES lotteries(id) ON DELETE CASCADE,
        vk_user_id INTEGER NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        photo VARCHAR(255),
        joined_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Таблицы созданы или уже существуют');
  } catch (error) {
    console.error('❌ Ошибка создания таблиц:', error.message);
  }
};

module.exports = initDB;