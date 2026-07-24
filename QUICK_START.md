# 🚀 Vercel 部署 - 5 步完成

## 总览

```
你的代码 → GitHub → Vercel + Supabase → 永久在线链接 ✨
```

**总耗时**: 约 30 分钟  
**难度**: ⭐⭐☆☆☆ (简单)  
**费用**: 完全免费

---

## 快速 5 步

### 1️⃣ Supabase - 创建数据库 (5分钟)
```
https://supabase.com
→ New Project
→ 设置密码
→ 复制连接字符串
```
**得到**: `postgresql://postgres.xxxx:密码@host:5432/postgres`

---

### 2️⃣ GitHub - 创建仓库 (3分钟)
```
https://github.com/new
→ 填写仓库名
→ Create repository
```
**得到**: 仓库地址

---

### 3️⃣ 本地 - 推送代码 (5分钟)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/ktv-proposition.git
git push -u origin main
```
**得到**: 代码上传到 GitHub

---

### 4️⃣ Vercel - 部署项目 (5分钟)
```
https://vercel.com
→ Import GitHub 仓库
→ 配置环境变量：
   DATABASE_URL = Supabase连接字符串
   JWT_SECRET = 随机字符串
   NODE_ENV = production
→ Deploy
```
**得到**: `https://你的项目.vercel.app`

---

### 5️⃣ 测试 - 验证功能 (5分钟)
```
打开链接
→ 测试转盘
→ 测试注册登录
→ 添加自定义命题
→ 分享给朋友！
```

---

## 📝 需要准备的信息

部署前准备好这些：

1. **GitHub 账号**
2. **Supabase 数据库密码**（你自己设置）
3. **JWT 密钥**（随便输入，比如 `ktv-secret-123`）

---

## 🎯 最终成果

部署成功后你会得到：

- ✅ 一个永久链接：`https://你的项目.vercel.app`
- ✅ 自动 HTTPS 加密
- ✅ 全球 CDN 加速
- ✅ 自动备份和扩展
- ✅ 任何人都能访问

---

## 📚 详细文档

- **完整教程**: [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md)
- **部署清单**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- **项目说明**: [README.md](README.md)

---

## 🆘 常见问题

**Q: 需要花钱吗？**  
A: 不需要，Supabase 和 Vercel 都有免费版，足够个人项目使用。

**Q: 链接是永久的吗？**  
A: 是的，除非你主动删除项目。

**Q: 可以修改代码吗？**  
A: 可以，本地修改后 `git push`，Vercel 会自动重新部署。

**Q: 能绑定自己的域名吗？**  
A: 可以，在 Vercel 项目设置中添加自定义域名。

---

## ⏱️ 时间轴参考

| 时间 | 任务 | 状态 |
|------|------|------|
| 0-5分钟 | 注册 Supabase，创建数据库 | ⏳ |
| 5-8分钟 | 创建 GitHub 仓库 | ⏳ |
| 8-13分钟 | 推送代码 | ⏳ |
| 13-18分钟 | Vercel 部署 | ⏳ |
| 18-23分钟 | 测试验证 | ⏳ |
| **23分钟** | **完成！** | ✅ |

---

**准备好了吗？开始第一步** → [完整教程](VERCEL_DEPLOY.md)
