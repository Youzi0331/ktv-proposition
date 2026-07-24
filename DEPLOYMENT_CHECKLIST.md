# Vercel 部署清单 ✅

按照此清单逐步操作，确保部署顺利。

## ☑️ 准备工作（10分钟）

- [ ] 注册 GitHub 账号（如果没有）
- [ ] 注册 Vercel 账号（用 GitHub 登录）
- [ ] 注册 Supabase 账号（用 GitHub 登录）

---

## ☑️ Supabase 数据库配置（5分钟）

1. - [ ] 访问 https://supabase.com
2. - [ ] 点击 **New Project**
3. - [ ] 填写项目信息：
   - Name: `ktv-database`
   - Password: 设置并**记录密码**
   - Region: 选择 **Northeast Asia (Tokyo)**
4. - [ ] 点击 **Create new project**，等待 2-3 分钟
5. - [ ] 项目创建完成后，进入 **Project Settings** → **Database**
6. - [ ] 复制 **Connection string (URI)**
7. - [ ] 将 `[YOUR-PASSWORD]` 替换为你的密码
8. - [ ] **保存完整的连接字符串**（稍后会用）

```
示例：
postgresql://postgres.abcdefgh:你的密码@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

---

## ☑️ GitHub 仓库创建（3分钟）

1. - [ ] 访问 https://github.com/new
2. - [ ] 填写仓库信息：
   - Repository name: `ktv-proposition`
   - 选择 Public 或 Private
   - **不要勾选** "Add a README file"
3. - [ ] 点击 **Create repository**
4. - [ ] **记录仓库 URL**（格式：`https://github.com/你的用户名/ktv-proposition.git`）

---

## ☑️ 推送代码到 GitHub（5分钟）

在项目目录 `e:\vibecoding\ktv` 打开终端，依次执行：

```bash
# 1. 初始化 Git
git init

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "Initial commit: 命题KTV"

# 4. 关联远程仓库（替换成你的 GitHub 用户名和仓库名）
git remote add origin https://github.com/你的用户名/ktv-proposition.git

# 5. 推送
git branch -M main
git push -u origin main
```

- [ ] 代码推送成功
- [ ] 刷新 GitHub 页面确认代码已上传

---

## ☑️ Vercel 部署（5分钟）

1. - [ ] 访问 https://vercel.com
2. - [ ] 用 GitHub 账号登录
3. - [ ] 点击 **Add New...** → **Project**
4. - [ ] 找到 `ktv-proposition` 仓库，点击 **Import**
5. - [ ] 配置项目：
   - Project Name: 保持默认或修改
   - Framework Preset: 保持 **Other**
   - Root Directory: 保持 `./`

6. - [ ] **配置环境变量**（点击 Environment Variables 展开）：

| Variable Name | Value |
|---------------|-------|
| `DATABASE_URL` | 粘贴你的 Supabase 连接字符串 |
| `JWT_SECRET` | 输入随机字符串，如 `ktv-secret-2024-xyz` |
| `NODE_ENV` | `production` |

7. - [ ] 点击 **Deploy**
8. - [ ] 等待 1-2 分钟部署完成

---

## ☑️ 测试验证（5分钟）

1. - [ ] 复制 Vercel 给你的链接（格式：`https://xxx.vercel.app`）
2. - [ ] 在浏览器打开链接
3. - [ ] 测试游客模式：
   - [ ] 点击"开始"按钮
   - [ ] 点击"停止"按钮
   - [ ] 添加歌曲到曲库
   - [ ] 点击"帮我作答"
4. - [ ] 测试登录功能：
   - [ ] 点击"登录"
   - [ ] 注册新账号
   - [ ] 添加自定义命题
   - [ ] 查看"我的命题"

---

## ✅ 完成

- [ ] **保存你的部署链接**：`https://_________________.vercel.app`
- [ ] 分享给朋友测试
- [ ] 收集反馈

---

## 🆘 遇到问题？

### 部署失败
- 检查 DATABASE_URL 是否正确（密码部分不能有占位符）
- 检查所有环境变量是否都填写了

### 页面打不开
- 等待 3-5 分钟冷启动
- 检查 Vercel 部署日志是否有错误

### 注册/登录失败
- 打开浏览器开发者工具（F12）查看 Network 标签
- 查看 Vercel 的 Functions 日志

### 数据库连接失败
- 确认 Supabase 项目状态为 Active
- 重新复制连接字符串，确保没有多余空格

---

**需要帮助？** 把错误信息发给我，我来协助解决！
