# 命题KTV 🎤

一个有趣的社交小工具，通过随机命题和音乐推荐，为你的聚会和聊天增添乐趣。

**🚀 立即部署**: [查看 Vercel 部署指南](VERCEL_DEPLOY.md) - 获得一个可以分享给任何人的永久链接！

## 在线体验

部署后你会得到类似这样的链接：`https://你的项目名.vercel.app`

## 功能特性

### 游客模式
- ✅ 50道精选内置命题
- ✅ 本地曲库管理
- ✅ 转盘随机抽题
- ✅ 智能推荐3首歌曲

### 登录后解锁
- 🔐 云端曲库同步，跨设备使用
- 📝 自定义命题，打造专属玩法
- 💾 数据永久保存
- 🎯 内置命题 + 自定义命题混合

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动后端服务

```bash
npm start
```

服务将运行在 `http://localhost:3000`

### 3. 打开前端

在浏览器中打开：`http://localhost:3000`

或直接打开 `frontend/index.html`（如果后端已启动）

## 开发模式

使用 nodemon 自动重启：

```bash
npm run dev
```

## 项目结构

```
ktv/
├── frontend/              # 前端文件
│   ├── index.html        # 主页面
│   ├── styles.css        # 样式
│   ├── app.js           # 核心逻辑
│   └── data.js          # 命题库
├── backend/              # 后端服务
│   ├── server.js        # Express 服务器
│   ├── db.js           # 数据库操作
│   ├── auth.js         # 认证中间件
│   └── database.sqlite # SQLite 数据库（自动生成）
├── package.json
├── .env                 # 环境变量
└── README.md
```

## 技术栈

### 前端
- 原生 JavaScript（零依赖）
- HTML5 + CSS3
- LocalStorage（游客模式）
- Fetch API（云端同步）

### 后端
- Node.js + Express
- SQLite3（轻量数据库）
- JWT 认证
- bcryptjs 密码加密

## 使用说明

### 游客模式
1. 打开页面即可直接玩
2. 点击"开始"按钮，命题快速滚动
3. 点击"停止"，命题停止并可以"帮我作答"
4. 点击"帮我作答"，随机推荐3首你曲库里的歌
5. 点击"我的曲库"可以添加/删除歌曲（保存在浏览器本地）

### 登录后
1. 点击"登录"按钮注册/登录账号
2. 游客模式的曲库会自动迁移到云端
3. 可以添加自定义命题（点击"📝 我的命题"）
4. 转盘会混合内置命题和你的自定义命题
5. 换设备登录后数据自动同步

## API 接口

### 认证
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /api/auth/verify` - 验证Token

### 曲库
- `GET /api/songs` - 获取用户曲库
- `POST /api/songs` - 添加歌曲
- `DELETE /api/songs/:id` - 删除歌曲

### 命题
- `GET /api/topics` - 获取自定义命题
- `POST /api/topics` - 添加命题
- `DELETE /api/topics/:id` - 删除命题

## 环境变量

在 `.env` 文件中配置：

```env
PORT=3000
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

## 部署建议

### 本地/测试
- 直接运行 `npm start`
- 数据库文件 `backend/database.sqlite` 会自动创建

### 生产环境
1. 修改 `.env` 中的 `JWT_SECRET` 为强随机字符串
2. 修改 `frontend/app.js` 中的 `API_BASE` 为你的域名
3. 使用 PM2 或 systemd 保持后端服务运行
4. 配置 Nginx 反向代理
5. 启用 HTTPS

## 后续规划

- [ ] 社交分享（生成命题+推荐歌曲卡片）
- [ ] 命题分类标签（爱情/友情/职场）
- [ ] 历史记录
- [ ] 音乐链接集成（网易云/QQ音乐）
- [ ] 多人房间联机模式
- [ ] 命题审核后台

## License

MIT

---

Made with ❤️ by Kiro
