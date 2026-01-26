# iGame Lab 官网

智能可视化与仿真实验室官方网站 - 基于 Next.js 构建的现代化 Web 应用

## 📋 目录

- [项目简介](#项目简介)
- [主要功能](#主要功能)
- [技术栈](#技术栈)
- [环境要求](#环境要求)
- [环境变量配置](#环境变量配置)
- [安装与运行](#安装与运行)
- [项目结构](#项目结构)
- [常用命令](#常用命令)
- [故障排除](#故障排除)

---

## 项目简介

iGame Lab（智能可视化与仿真实验室）官网由杭州电子科技大学计算机学院图形图像所打造，集成了 AI 聊天助手、向量搜索记忆系统和丰富的视觉效果。

## 主要功能

- **🤖 AI 智能助手** - 多意图识别、持久化对话、RAG 智能回答
- **📚 记忆管理系统** - 文档上传、智能分块、向量存储、语义搜索
- **🎨 视觉特效** - Canvas 背景动画、3D 粒子效果、流畅页面过渡

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Next.js 16 + React 19 + TypeScript |
| 样式方案 | Tailwind CSS 4 |
| 动画库 | Framer Motion |
| 3D 渲染 | Three.js + React Three Fiber |
| AI 模型 | OpenAI GPT + LangChain |
| 向量数据库 | Pinecone |
| 数据库 | Neon PostgreSQL |
| 代码规范 | ESLint + TypeScript |

---

## 环境要求

- **Node.js**: 18.0 或更高版本
- **包管理器**: npm / yarn / pnpm
- **数据库**: Neon PostgreSQL（云端）
- **API 密钥**: OpenAI、Pinecone

---

## 环境变量配置

### 1. 复制环境变量模板

```bash
cd /Users/wucanhao/Documents/igame
cp env.example .env.local
```

### 2. 配置环境变量

编辑 `.env.local` 文件，填写以下配置：

```env
# ===========================================
# Neon PostgreSQL 数据库（必需）
# ===========================================
# 获取地址：https://console.neon.tech/
DATABASE_URL="postgresql://username:password@hostname/dbname?sslmode=require"

# ===========================================
# OpenAI API（必需）
# ===========================================
# 获取地址：https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_API_BASE_URL=https://api.openai.com/v1

# ===========================================
# Pinecone 向量数据库（必需）
# ===========================================
# 获取地址：https://app.pinecone.io/
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=igame-lab-memory

# ===========================================
# DeepSeek API（可选）
# ===========================================
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
```

### 3. 获取 API 密钥

| 服务 | 注册地址 | 说明 |
|------|----------|------|
| Neon | https://console.neon.tech/ | 免费 PostgreSQL 数据库 |
| OpenAI | https://platform.openai.com/api-keys | AI 模型服务 |
| Pinecone | https://app.pinecone.io/ | 向量数据库服务 |

---

## 安装与运行

### 步骤 1：安装依赖

```bash
npm install
```

### 步骤 2：配置环境变量

```bash
cp env.example .env.local
# 编辑 .env.local 填入您的 API 密钥
```

### 步骤 3：初始化数据库

```bash
# 推送 schema 到数据库
npm run db:push

# 或者执行迁移（推荐）
npm run db:migrate
```

### 步骤 4：启动开发服务器

```bash
npm run dev
```

### 步骤 5：访问应用

打开浏览器访问：**http://localhost:3000**

---

## 项目结构

```
igame/
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   ├── chat/                 # AI 聊天接口
│   │   ├── memories/             # 记忆管理接口
│   │   └── students/             # 学生信息接口
│   ├── components/               # React 组件
│   │   ├── ai/                   # AI 相关组件
│   │   ├── effects/              # 视觉特效组件
│   │   ├── layout/               # 布局组件
│   │   └── ui/                   # UI 基础组件
│   ├── contact/                  # 联系页面
│   ├── research/                 # 研究页面
│   ├── team/                     # 团队页面
│   ├── teambuilding/             # 团建页面
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 首页
├── lib/                          # 工具库
│   ├── ai/                       # AI 相关逻辑
│   │   ├── chat.ts               # 聊天服务
│   │   ├── embeddings.ts         # 向量嵌入
│   │   └── rag-chain.ts          # RAG 链
│   └── db/                       # 数据库相关
│       ├── mysql.ts              # MySQL 连接
│       └── prisma.ts             # Prisma 客户端
├── prisma/                       # Prisma Schema
│   └── schema.prisma             # 数据库模型定义
├── scripts/                      # 脚本文件
├── public/                       # 静态资源
│   ├── images/                   # 图片资源
│   └── static/                   # 静态文件
└── env.example                   # 环境变量模板
```

---

## 常用命令

### 开发命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 代码检查 |
| `npm run typecheck` | TypeScript 类型检查 |

### 数据库命令

| 命令 | 说明 |
|------|------|
| `npm run db:push` | 推送 schema 到数据库 |
| `npm run db:migrate` | 执行数据库迁移 |
| `npm run db:studio` | 打开 Prisma Studio |
| `npm run db:generate` | 生成 Prisma 客户端 |

### 其他命令

| 命令 | 说明 |
|------|------|
| `npm run create-pinecone-index` | 创建 Pinecone 索引 |
| `npm run init-db` | 初始化数据库表 |

---

## 故障排除

### 1. 数据库连接失败

```bash
# 测试数据库连接
npm run db:push

# 如果失败，检查 DATABASE_URL 格式是否正确
cat .env.local | grep DATABASE_URL
```

### 2. AI 功能不可用

```bash
# 检查 OpenAI API 密钥
echo $OPENAI_API_KEY

# 验证密钥格式
# 正确的格式：sk-xxxxxxx...
```

### 3. 向量搜索无结果

```bash
# 检查 Pinecone 配置
npm run create-pinecone-index

# 确认索引名称
cat .env.local | grep PINECONE_INDEX_NAME
```

### 4. 依赖安装失败

```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install

# 使用淘宝镜像（国内用户）
npm install --registry=https://registry.npmmirror.com
```

### 5. 端口被占用

```bash
# 查看占用 3000 端口的进程
lsof -i :3000

# 终止进程
kill -9 <PID>

# 或者使用其他端口
npm run dev -- -p 3001
```

---

## 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 访问 [Vercel](https://vercel.com) 并导入项目
3. 在 Vercel 中配置环境变量
4. 自动部署完成

---

## 许可证

MIT License

---

## 联系方式

- **实验室官网**: https://igame-lab.dasusm.com
- **维护团队**: 杭州电子科技大学 iGame Lab

