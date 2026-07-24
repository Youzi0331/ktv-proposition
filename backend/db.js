const Database = require('better-sqlite3');
const path = require('path');

// 初始化数据库
const db = new Database(path.join(__dirname, 'database.sqlite'));

// 创建表结构
function initDatabase() {
    // 用户表
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 用户曲库表
    db.exec(`
        CREATE TABLE IF NOT EXISTS user_songs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            song_name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // 自定义命题表
    db.exec(`
        CREATE TABLE IF NOT EXISTS user_topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            topic_text TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // 创建索引
    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_user_songs_user_id ON user_songs(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_topics_user_id ON user_topics(user_id);
    `);
}

// 先初始化表结构
initDatabase();

// ============ 用户操作 ============
const userQueries = {
    create: db.prepare('INSERT INTO users (username, password) VALUES (?, ?)'),
    findByUsername: db.prepare('SELECT * FROM users WHERE username = ?'),
    findById: db.prepare('SELECT id, username, created_at FROM users WHERE id = ?')
};

// ============ 曲库操作 ============
const songQueries = {
    getAll: db.prepare('SELECT id, song_name, created_at FROM user_songs WHERE user_id = ? ORDER BY created_at DESC'),
    add: db.prepare('INSERT INTO user_songs (user_id, song_name) VALUES (?, ?)'),
    delete: db.prepare('DELETE FROM user_songs WHERE id = ? AND user_id = ?'),
    checkDuplicate: db.prepare('SELECT id FROM user_songs WHERE user_id = ? AND song_name = ?')
};

// ============ 命题操作 ============
const topicQueries = {
    getAll: db.prepare('SELECT id, topic_text, created_at FROM user_topics WHERE user_id = ? ORDER BY created_at DESC'),
    add: db.prepare('INSERT INTO user_topics (user_id, topic_text) VALUES (?, ?)'),
    delete: db.prepare('DELETE FROM user_topics WHERE id = ? AND user_id = ?'),
    checkDuplicate: db.prepare('SELECT id FROM user_topics WHERE user_id = ? AND topic_text = ?')
};

module.exports = {
    db,
    userQueries,
    songQueries,
    topicQueries
};
