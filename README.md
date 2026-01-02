# iGame Lab 官网

智能可视化与仿真实验室官方网站 - 基于 Next.js 构建的现代化 Web 应用

## 🚀 项目简介

这是一个专为杭州电子科技大学 iGame Lab（智能可视化与仿真实验室）打造的官方网站，集成了先进的 AI 聊天助手、向量搜索记忆系统和丰富的视觉效果。

## ✨ 主要功能

### 🤖 AI 智能助手
- **多意图识别**：自动识别用户查询意图（时间查询、实验室相关问题等）
- **持久化对话**：基于本地存储的对话历史记录
- **智能记忆系统**：集成 RAG（检索增强生成）技术，提供精准回答
- **实时响应**：流畅的实时对话体验

### 📚 记忆管理系统
- **多样化上传**：支持文本文件、PDF 文档的直接上传
- **智能分块**：自动将长文档分割为合适大小的块
- **向量存储**：使用 Pinecone 云向量数据库进行高效存储和检索
- **语义搜索**：基于向量相似度的智能内容检索

### 🎨 视觉特效
- **高级 Canvas 背景**：多层次动态视觉效果
  - 🌊 **流体粒子系统**：智能粒子动画，鼠标交互响应
  - 🧠 **神经网络网格**：黑色节点网络，智能连接算法，数据流脉冲效果
  - 🌊 **波浪动画**：多层波浪效果，营造流动感
  - 🔷 **浮动几何图形**：旋转的三角形、六边形等几何形状
  - ⚡ **性能优化**：智能帧率控制，设备性能自适应
  - 🎛️ **实时控制面板**：可调节粒子数量、动画速度等参数
  - 🐌 **优雅动画速度**：整体动画节奏减慢，更具沉浸感
- **3D 粒子背景**：动态粒子系统营造科技感
- **流畅动画**：基于 Framer Motion 的页面过渡动画
- **响应式设计**：完美适配各种设备屏幕
- **滚动特效**：智能滚动进度指示器

## 🏗️ 技术架构

### 前端技术栈
```
Next.js 16 + React 19 + TypeScript
Tailwind CSS + Framer Motion
Three.js + React Three Fiber
Canvas API + Web Animations
```

### AI & 数据层
```
OpenAI GPT 系列模型
Pinecone 向量数据库
LangChain 框架
```

### 开发工具
```
ESLint + TypeScript
Vercel 部署平台
```

## 📁 项目结构

```
my-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   ├── chat/                 # 聊天 API
│   │   └── memories/             # 记忆管理 API
│   ├── components/               # 页面组件
│   │   ├── ai/                   # AI 相关组件
│   │   ├── effects/              # 视觉特效
│   │   ├── layout/               # 布局组件
│   │   └── ui/                   # UI 基础组件
│   ├── admin/                    # 管理页面
│   ├── contact/                  # 联系页面
│   ├── research/                 # 研究页面
│   ├── team/                     # 团队页面
│   ├── teambuilding/             # 团建页面
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 首页
├── lib/                          # 工具库
│   ├── ai/                       # AI 相关工具
│   │   ├── chat.ts               # 聊天服务
│   │   ├── embeddings.ts         # 向量嵌入
│   │   ├── rag-chain.ts          # RAG 系统
│   │   └── tools.ts              # AI 工具
│   ├── db/                       # 数据库相关
│   └── animations.ts             # 动画工具
├── hooks/                        # 自定义 Hooks
├── scripts/                      # 脚本文件
│   ├── setup/                    # 设置脚本
│   ├── test/                     # 测试脚本
│   └── maintenance/              # 维护脚本
├── data/                         # 数据文件
│   └── memories/                 # 记忆文档
├── public/                       # 静态资源
└── docs/                         # 项目文档
```

## 🛠️ 快速开始

### 环境要求
- Node.js 18+
- npm/yarn/pnpm

### 安装依赖
```bash
npm install
```

### 环境配置
复制环境变量模板：
```bash
cp env.example .env.local
```

配置以下环境变量：
```bash
# OpenAI API 配置
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_BASE_URL=https://api.openai.com/v1

# Pinecone 向量数据库
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=igame-lab-memory
```

### 数据库设置

#### MySQL 数据库设置

**自动设置（推荐）**
```bash
# 设置数据库密码（根据需要修改）
export DB_PASSWORD=your_mysql_password

# 运行自动化脚本
npm run setup-db
```

脚本将自动完成：
- ✅ 检查系统环境
- ✅ 创建数据库和用户
- ✅ 设置权限
- ✅ 创建表和视图
- ✅ 生成配置文件
- ✅ 验证设置

**手动设置**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql

# CentOS/RHEL
sudo yum install mysql-server
sudo systemctl start mysqld
```

配置数据库：
```bash
# 连接到MySQL
mysql -u root -p

# 在MySQL命令行中执行：
CREATE DATABASE igame_lab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'igame_app'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON igame_lab.* TO 'igame_app'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**创建数据表和视图**

如果您倾向于手动创建表和视图，可以在MySQL命令行中依次执行以下SQL语句：

```sql
-- 切换到数据库
USE igame_lab;

-- 创建记忆文档表
CREATE TABLE IF NOT EXISTS memory_documents (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content LONGTEXT NOT NULL,
  type VARCHAR(100) NOT NULL,
  file_name VARCHAR(500),
  chunk_index INT DEFAULT 0,
  total_chunks INT DEFAULT 1,
  pinecone_id VARCHAR(200) NOT NULL,
  status ENUM('active', 'deleted') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_status (status),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at),
  INDEX idx_pinecone_id (pinecone_id),
  INDEX idx_file_name (file_name),

  FULLTEXT INDEX ft_title_content (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建统计视图
CREATE OR REPLACE VIEW memory_stats AS
SELECT
  COUNT(*) as total_documents,
  SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_documents,
  SUM(CASE WHEN status = 'deleted' THEN 1 ELSE 0 END) as deleted_documents,
  COUNT(DISTINCT type) as unique_types
FROM memory_documents;
```

#### Pinecone 向量数据库设置

**获取 API 密钥**
1. 访问 [Pinecone官网](https://www.pinecone.io/)
2. 创建账户并登录
3. 在控制台中创建API密钥

**创建索引**
```bash
# 设置环境变量
export PINECONE_API_KEY=your_api_key_here
export PINECONE_INDEX_NAME=igame-lab-memory  # 可选，默认值

# 创建索引
npm run create-pinecone-index
```

**重要说明**：Pinecone API密钥是必需的，系统现在强制要求配置才能使用记忆功能。

### 初始化数据
```bash
# 初始化数据库表
npm run init-db

# 初始化记忆数据（可选）
npm run init-memories
```

### 启动开发服务器
```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📜 可用脚本

### 开发命令
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
```

### 数据库管理
```bash
npm run setup-db                # 自动设置MySQL数据库
npm run init-db                 # 初始化数据库表和视图
npm run test-db                 # 测试数据库连接
npm run create-pinecone-index   # 创建 Pinecone 索引
npm run init-memories           # 初始化记忆数据
npm run test-pinecone           # 测试 Pinecone 连接
```


## 🚨 快速故障排除

### 数据库连接问题
```bash
# 测试数据库连接
npm run test-db

# 如果失败，运行自动设置
npm run setup-db
```

### Pinecone连接问题
```bash
# 测试Pinecone连接
npm run test-pinecone
```

### Pinecone 连接问题
```bash
# 测试Pinecone连接
npm run test-pinecone

# 如果失败，检查API密钥配置
echo $PINECONE_API_KEY
```

### 记忆文档显示问题
如果记忆文档列表显示0个文档但Pinecone中有记录：

1. **检查环境变量**
   ```bash
   # 确保API密钥正确配置
   npm run test-pinecone
   ```

2. **常见原因**
   - 向量维度不匹配（需要1536维）
   - 查询策略问题
   - API权限不足

3. **快速修复**
   ```bash
   # 重新生成向量
   # 删除现有文档，重新上传
   ```

### 应用无法启动
```bash
# 检查环境变量
cat .env.local

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

## 🚀 部署

### Vercel 部署
1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署完成

### 手动部署
```bash
npm run build
npm run start
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

iGame Lab - [实验室官网](https://igame-lab.dasusm.com)

项目维护者：徐岗教授研究团队