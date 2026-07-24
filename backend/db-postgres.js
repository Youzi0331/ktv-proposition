const { Pool } = require('pg');

// 创建数据库连接池
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// 初始化数据库表
async function initDatabase() {
    const client = await pool.connect();
    try {
        // 用户表
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 用户曲库表
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_songs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                song_name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 自定义命题表
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_topics (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                topic_text TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 创建索引
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_user_songs_user_id ON user_songs(user_id)
        `);
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_user_topics_user_id ON user_topics(user_id)
        `);

        console.log('✅ 数据库表初始化成功');
    } catch (error) {
        console.error('❌ 数据库初始化失败:', error);
    } finally {
        client.release();
    }
}

// ============ 用户操作 ============
const userQueries = {
    async create(username, password) {
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
            [username, password]
        );
        return result.rows[0];
    },

    async findByUsername(username) {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        return result.rows[0];
    },

    async findById(id) {
        const result = await pool.query(
            'SELECT id, username, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }
};

// ============ 曲库操作 ============
const songQueries = {
    async getAll(userId) {
        const result = await pool.query(
            'SELECT id, song_name, created_at FROM user_songs WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        return result.rows;
    },

    async add(userId, songName) {
        const result = await pool.query(
            'INSERT INTO user_songs (user_id, song_name) VALUES ($1, $2) RETURNING id',
            [userId, songName]
        );
        return result.rows[0];
    },

    async delete(id, userId) {
        const result = await pool.query(
            'DELETE FROM user_songs WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        return result.rowCount;
    },

    async checkDuplicate(userId, songName) {
        const result = await pool.query(
            'SELECT id FROM user_songs WHERE user_id = $1 AND song_name = $2',
            [userId, songName]
        );
        return result.rows[0];
    }
};

// ============ 命题操作 ============
const topicQueries = {
    async getAll(userId) {
        const result = await pool.query(
            'SELECT id, topic_text, created_at FROM user_topics WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        return result.rows;
    },

    async add(userId, topicText) {
        const result = await pool.query(
            'INSERT INTO user_topics (user_id, topic_text) VALUES ($1, $2) RETURNING id',
            [userId, topicText]
        );
        return result.rows[0];
    },

    async delete(id, userId) {
        const result = await pool.query(
            'DELETE FROM user_topics WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        return result.rowCount;
    },

    async checkDuplicate(userId, topicText) {
        const result = await pool.query(
            'SELECT id FROM user_topics WHERE user_id = $1 AND topic_text = $2',
            [userId, topicText]
        );
        return result.rows[0];
    }
};

module.exports = {
    pool,
    initDatabase,
    userQueries,
    songQueries,
    topicQueries
};
