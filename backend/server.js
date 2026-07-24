require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { initDatabase, userQueries, songQueries, topicQueries } = require('./db-postgres');
const { generateToken, authenticateToken } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// 初始化数据库
initDatabase();

// ============ 认证接口 ============

// 注册
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 验证输入
        if (!username || !password) {
            return res.status(400).json({ error: '用户名和密码不能为空' });
        }

        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ error: '用户名长度为 3-20 个字符' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: '密码至少 6 个字符' });
        }

        // 检查用户名是否存在
        const existing = await userQueries.findByUsername(username);
        if (existing) {
            return res.status(400).json({ error: '用户名已存在' });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 创建用户
        const result = await userQueries.create(username, hashedPassword);
        const userId = result.id;

        // 生成 Token
        const token = generateToken(userId);

        res.json({
            success: true,
            token,
            user: { id: userId, username }
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ error: '注册失败' });
    }
});

// 登录
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: '用户名和密码不能为空' });
        }

        // 查找用户
        const user = await userQueries.findByUsername(username);
        if (!user) {
            return res.status(400).json({ error: '用户名或密码错误' });
        }

        // 验证密码
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: '用户名或密码错误' });
        }

        // 生成 Token
        const token = generateToken(user.id);

        res.json({
            success: true,
            token,
            user: { id: user.id, username: user.username }
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ error: '登录失败' });
    }
});

// 验证 Token（用于自动登录）
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
    try {
        const user = await userQueries.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('验证错误:', error);
        res.status(500).json({ error: '验证失败' });
    }
});

// ============ 曲库接口 ============

// 获取用户曲库
app.get('/api/songs', authenticateToken, async (req, res) => {
    try {
        const songs = await songQueries.getAll(req.userId);
        res.json({ success: true, songs });
    } catch (error) {
        console.error('获取曲库错误:', error);
        res.status(500).json({ error: '获取曲库失败' });
    }
});

// 添加歌曲
app.post('/api/songs', authenticateToken, async (req, res) => {
    try {
        const { songName } = req.body;

        if (!songName || !songName.trim()) {
            return res.status(400).json({ error: '歌名不能为空' });
        }

        const trimmedName = songName.trim();

        // 检查重复
        const duplicate = await songQueries.checkDuplicate(req.userId, trimmedName);
        if (duplicate) {
            return res.status(400).json({ error: '这首歌已经在曲库里了' });
        }

        // 添加歌曲
        const result = await songQueries.add(req.userId, trimmedName);

        res.json({
            success: true,
            song: {
                id: result.id,
                song_name: trimmedName
            }
        });
    } catch (error) {
        console.error('添加歌曲错误:', error);
        res.status(500).json({ error: '添加歌曲失败' });
    }
});

// 删除歌曲
app.delete('/api/songs/:id', authenticateToken, async (req, res) => {
    try {
        const songId = parseInt(req.params.id);
        const rowCount = await songQueries.delete(songId, req.userId);

        if (rowCount === 0) {
            return res.status(404).json({ error: '歌曲不存在' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('删除歌曲错误:', error);
        res.status(500).json({ error: '删除歌曲失败' });
    }
});

// ============ 命题接口 ============

// 获取用户自定义命题
app.get('/api/topics', authenticateToken, async (req, res) => {
    try {
        const topics = await topicQueries.getAll(req.userId);
        res.json({ success: true, topics });
    } catch (error) {
        console.error('获取命题错误:', error);
        res.status(500).json({ error: '获取命题失败' });
    }
});

// 添加自定义命题
app.post('/api/topics', authenticateToken, async (req, res) => {
    try {
        const { topicText } = req.body;

        if (!topicText || !topicText.trim()) {
            return res.status(400).json({ error: '命题内容不能为空' });
        }

        const trimmedText = topicText.trim();

        if (trimmedText.length < 10) {
            return res.status(400).json({ error: '命题内容至少 10 个字符' });
        }

        // 检查重复
        const duplicate = await topicQueries.checkDuplicate(req.userId, trimmedText);
        if (duplicate) {
            return res.status(400).json({ error: '这个命题已经存在了' });
        }

        // 添加命题
        const result = await topicQueries.add(req.userId, trimmedText);

        res.json({
            success: true,
            topic: {
                id: result.id,
                topic_text: trimmedText
            }
        });
    } catch (error) {
        console.error('添加命题错误:', error);
        res.status(500).json({ error: '添加命题失败' });
    }
});

// 删除自定义命题
app.delete('/api/topics/:id', authenticateToken, async (req, res) => {
    try {
        const topicId = parseInt(req.params.id);
        const rowCount = await topicQueries.delete(topicId, req.userId);

        if (rowCount === 0) {
            return res.status(404).json({ error: '命题不存在' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('删除命题错误:', error);
        res.status(500).json({ error: '删除命题失败' });
    }
});

// ============ 健康检查 ============
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: '命题KTV API 运行中' });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🎤 命题KTV 服务器运行在 http://localhost:${PORT}`);
});
