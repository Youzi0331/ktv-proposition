# Vercel 部署指南 🚀

按照以下步骤将"命题KTV"部署到 Vercel，获得一个可以分享给任何人的永久链接。

## 📋 前置准备

你需要：
1. GitHub 账号
2. Vercel 账号（用 GitHub 登录即可）
3. Supabase 账号（免费 PostgreSQL 数据库）

---

## 第一步：注册 Supabase 并创建数据库

### 1. 访问 Supabase
打开：https://supabase.com
点击 **Start your project** → 用 GitHub 登录

### 2. 创建项目
- 点击 **New Project**
- **Name**: `ktv-database`（随便起）
- **Database Password**: 设置一个密码并**记住它**
- **Region**: 选择 **Northeast Asia (Tokyo)** 或 **Southeast Asia (Singapore)**（离中国近，速度快）
- 点击 **Create new project**

等待 2-3 分钟初始化完成。

### 3. 获取数据库连接字符串
项目创建完成后：
1. 左侧菜单点击 **Project Settings** ⚙️
2. 点击 **Database**
3. 找到 **Connection string** 部分
4. 选择 **URI** 标签
5. 复制连接字符串（类似这样）：
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
   ```
6. 把 `[YOUR-PASSWORD]` 替换成你刚才设置的密码
7. **保存这个连接字符串**，后面会用到

---

## 第二步：推送代码到 GitHub

### 1. 在 GitHub 创建新仓库
1. 访问 https://github.com/new
2. **Repository name**: `ktv-proposition`（随便起）
3. 选择 **Public**（公开）或 **Private**（私有都可以）
4. **不要勾选** "Add a README file"
5. 点击 **Create repository**

### 2. 初始化本地 Git 仓库
在项目目录打开终端，执行以下命令：

```bash
# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 命题KTV"

# 关联远程仓库（替换成你的 GitHub 用户名和仓库名）
git remote add origin https://github.com/你的用户名/ktv-proposition.git

# 推送
git branch -M main
git push -u origin main
```

刷新 GitHub 页面，应该能看到代码已经上传。

---

## 第三步：部署到 Vercel

### 1. 访问 Vercel
打开：https://vercel.com
点击 **Sign Up** → 用 GitHub 登录

### 2. 导入 GitHub 仓库
1. 点击 **Add New...** → **Project**
2. 找到你刚才创建的 `ktv-proposition` 仓库
3. 点击 **Import**

### 3. 配置项目
- **Project Name**: `ktv-proposition`（可以改成你喜欢的）
- **Framework Preset**: 保持默认 **Other**
- **Root Directory**: 保持默认 `./`

### 4. 配置环境变量 ⚠️ 重要
点击 **Environment Variables** 展开，添加以下变量：

| Name | Value |
|------|-------|
| `DATABASE_URL` | 粘贴你刚才保存的 Supabase 连接字符串 |
| `JWT_SECRET` | 随便输入一个复杂字符串，比如 `ktv-secret-2024-abc123xyz` |
| `NODE_ENV` | `production` |

### 5. 部署
点击 **Deploy** 按钮，等待 1-2 分钟。

---

## 第四步：获取并分享你的链接 🎉

部署成功后，Vercel 会显示：

**🎊 Congratulations!**

你会看到一个类似这样的链接：
```
https://ktv-proposition.vercel.app
```

或者

```
https://ktv-proposition-xxxxx.vercel.app
```

这就是你的永久链接！**复制这个链接分享给朋友**，他们就能玩了。

---

## 第五步：测试和验证

### 1. 打开你的链接
访问 Vercel 给你的链接，应该能看到"命题KTV"的页面。

### 2. 测试游客模式
- 点击"开始"按钮 → 转盘开始转
- 点击"停止" → 停止
- 添加几首歌到曲库
- 点击"帮我作答" → 应该能看到推荐歌曲

### 3. 测试登录功能
- 点击右上角"登录"
- 切换到"注册"
- 注册一个账号
- 添加自定义命题
- 点击"📝 我的命题"查看

如果都能正常工作，说明部署成功！

---

## 🔧 常见问题

### Q1: 部署失败怎么办？
- 检查 Supabase 连接字符串是否正确
- 确保密码部分没有 `[YOUR-PASSWORD]` 占位符
- 检查环境变量是否都填写了

### Q2: 页面打开很慢？
- 首次访问可能有 3-5 秒冷启动
- 后续访问会很快
- 这是 Vercel 免费版的特性

### Q3: 想修改代码怎么办？
本地修改后：
```bash
git add .
git commit -m "更新说明"
git push
```
Vercel 会自动重新部署（1-2分钟）

### Q4: 想绑定自己的域名？
1. Vercel 项目设置 → **Domains**
2. 添加你的域名
3. 按提示在域名注册商添加 DNS 记录
4. 等待生效（几分钟到几小时）

---

## 🎉 完成

现在你有了：
- ✅ 一个永久在线的链接
- ✅ 自动 HTTPS 加密
- ✅ 全球 CDN 加速
- ✅ 免费托管

把链接分享给朋友，开始玩吧！🎤

**你的链接**: `https://你的项目名.vercel.app`

---

## 💡 下一步

- 查看 Vercel 后台的访问统计
- 在 Supabase 后台查看数据库记录
- 继续添加新功能
- 收集用户反馈

有问题随时问我！
