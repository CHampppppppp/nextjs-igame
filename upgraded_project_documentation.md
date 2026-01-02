# iGame Lab 升级项目文档

## 项目概述

**项目名称**: iGame Lab Next.js (Intelligent Visual Modeling & Simulation Lab)  
**升级目标**: 从静态网站升级为现代化全栈应用  
**技术栈**: Next.js 14 + TypeScript + TailwindCSS + AI 增强功能  
**部署平台**: DasuSM 云主机（中国大陆高速访问）  
**核心特性**: AI 聊天助手、RAG 长时记忆、现代化 UI/UX

## 技术架构升级

### 前端技术栈
- **框架**: Next.js 14 (App Router)
- **编程语言**: TypeScript
- **样式框架**: TailwindCSS
- **动画库**: Framer Motion + GSAP
- **3D 效果**: Three.js + React Three Fiber
- **物理引擎**: Matter.js
- **状态管理**: Zustand (轻量级状态管理)
- **表单处理**: React Hook Form + Zod

### 后端技术栈
- **API 路由**: Next.js API Routes
- **AI 集成**:
  - **聊天引擎**: DeepSeek API (deepseek-chat 模型)
  - **向量嵌入**: OpenAI text-embedding-3-small
  - **向量数据库**: ChromaDB (本地部署)
- **文档处理**: LangChain (PDF/文本解析和分割)
- **缓存**: Redis (可选，用于生产环境)

### 部署架构
```
DasuSM 云主机
├── Next.js 应用 (端口: 3000)
├── Nginx 反向代理 (端口: 80/443)
├── ChromaDB 向量数据库 (本地存储)
├── Redis 缓存 (可选)
└── SSL 证书 (Let's Encrypt)
```

## 项目结构设计

### Next.js App Router 结构
```
igame-lab-next/
├── app/                          # Next.js App Router
│   ├── (main)/                   # 主网站页面组
│   │   ├── page.tsx             # 首页
│   │   ├── team/                # 团队页面
│   │   │   ├── page.tsx
│   │   │   └── [slug]/          # 教师详情页
│   │   ├── research/            # 研究页面
│   │   │   └── page.tsx
│   │   ├── teambuilding/        # 团建页面
│   │   │   └── page.tsx
│   │   └── contact/             # 联系页面
│   │       └── page.tsx
│   ├── admin/                   # 管理页面 (隐藏路由)
│   │   └── memories/            # 记忆文档管理
│   │       └── page.tsx
│   ├── api/                     # API 路由
│   │   ├── chat/                # AI 聊天 API
│   │   │   └── route.ts
│   │   └── memories/            # 记忆文档 API
│   │       ├── route.ts         # 获取文档列表
│   │       └── upload/          # 上传文档
│   │           └── route.ts
│   ├── globals.css              # 全局样式
│   ├── layout.tsx               # 根布局
│   └── loading.tsx              # 全局加载组件
├── components/                  # React 组件
│   ├── ui/                      # 基础UI组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── input.tsx
│   │   └── badge.tsx
│   ├── layout/                  # 布局组件
│   │   ├── header.tsx           # 导航栏
│   │   ├── footer.tsx           # 页脚
│   │   ├── page-transition.tsx  # 页面切换动画
│   │   └── scroll-progress.tsx  # 滚动进度条
│   ├── sections/                # 页面区块组件
│   │   ├── hero-section.tsx     # 首页英雄区域
│   │   ├── about-section.tsx    # 关于我们
│   │   ├── research-grid.tsx    # 研究方向网格
│   │   ├── team-grid.tsx        # 团队网格
│   │   └── contact-form.tsx     # 联系表单
│   ├── ai/                      # AI相关组件
│   │   ├── chat-widget.tsx      # 聊天助手组件
│   │   ├── chat-message.tsx     # 聊天消息组件
│   │   └── memory-upload.tsx    # 记忆上传组件
│   ├── effects/                 # 视觉效果组件
│   │   ├── particle-background.tsx  # 粒子背景
│   │   ├── geometric-shapes.tsx     # 几何图形
│   │   └── scroll-animations.tsx    # 滚动动画
│   └── providers/               # 上下文提供者
│       ├── theme-provider.tsx
│       └── ai-provider.tsx
├── lib/                         # 工具函数和配置
│   ├── ai/                      # AI相关工具
│   │   ├── chat.ts              # 聊天逻辑
│   │   ├── embeddings.ts        # 向量嵌入
│   │   └── rag-chain.ts         # RAG 链配置
│   ├── db/                      # 数据库配置
│   │   └── schema.ts            # 数据模式
│   ├── utils/                   # 通用工具
│   │   ├── cn.ts                # 类名合并工具
│   │   ├── format.ts            # 格式化工具
│   │   └── animations.ts        # 动画工具
│   └── validations/             # 数据验证
│       └── contact-form.ts
├── types/                       # TypeScript 类型定义
│   ├── team.ts                  # 团队相关类型
│   ├── research.ts              # 研究相关类型
│   ├── ai.ts                    # AI相关类型
│   └── api.ts                   # API相关类型
├── data/                        # 数据文件
│   ├── team-members.json        # 团队成员数据
│   ├── research-data.json       # 研究数据
│   ├── papers.json              # 论文数据
│   └── memories/                # 记忆文档存储
├── public/                      # 静态资源
│   ├── images/                  # 图片资源
│   ├── fonts/                   # 字体文件
│   └── models/                  # 3D模型文件
├── hooks/                       # 自定义Hooks
│   ├── use-chat.ts              # 聊天Hook
│   ├── use-scroll.ts            # 滚动Hook
│   └── use-intersection.ts      # 交叉观察Hook
└── middleware.ts                # Next.js 中间件
```

## 核心功能实现

### 1. 现代化UI设计

#### 设计理念
- **智能科技感**: 符合"智能可视化建模与仿真实验室"主题
- **高级感**: 使用渐变、阴影、毛玻璃效果等现代设计元素
- **独特性**: 避免常见的设计套路，创造独特视觉体验
- **科技艺术**: 结合科技元素与艺术美学

#### 色彩方案
```css
/* 智能可视化主题色彩系统 */
--primary-blue: #2563eb        /* 主色调 - 科技蓝 */
--secondary-indigo: #4f46e5    /* 辅助色 - 靛蓝 */
--accent-purple: #7c3aed        /* 强调色 - 紫色 */
--success-green: #10b981        /* 成功色 - 翠绿 */
--warning-orange: #f59e0b       /* 警告色 - 橙色 */

/* 渐变系统 */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)
--gradient-dark: linear-gradient(135deg, #2d3748 0%, #1a202c 100%)

/* 背景系统 */
--bg-dark: #0f172a             /* 深色背景 */
--bg-light: #f8fafc           /* 浅色背景 */
--bg-glass: rgba(255, 255, 255, 0.1)  /* 毛玻璃效果 */
```

#### 动画系统
- **微交互**: Framer Motion 实现按钮悬停、表单反馈等
- **页面切换**: 流畅的淡入淡出和滑动过渡效果
- **3D 效果**: Three.js 实现背景粒子系统和几何动画
- **滚动动画**: GSAP 实现复杂的滚动触发动画
- **加载动画**: 骨架屏和流畅的加载状态

### 2. AI 聊天助手系统

#### 核心架构
```
用户输入 → DeepSeek API → RAG 检索 → 上下文增强 → 智能回复
                                    ↑
                            ChromaDB 向量数据库
                                    ↑
                            记忆文档 → 向量化处理
```

#### 聊天功能特性
- **右下角浮动按钮**: 现代化的聊天入口设计
- **实时对话**: 支持连续对话上下文保持
- **打字效果**: 流畅的文字逐字显示动画
- **消息状态**: 发送中、已读、错误状态指示
- **响应式设计**: 适配移动端和桌面端

#### RAG 长时记忆系统
- **知识库构建**: 实验室信息、教师资料、学生信息、研究成果
- **文档上传**: 支持 PDF、TXT、MD 格式文档
- **智能分块**: 基于语义的文档分割和向量化
- **相关性检索**: 基于用户查询的智能内容检索
- **上下文增强**: 在聊天回复中融入相关背景信息

#### 隐藏管理页面
- **URL 隐藏**: 无导航链接，仅通过直接URL访问
- **文档管理**: 上传、查看、删除记忆文档
- **处理状态**: 实时显示文档向量化处理进度
- **安全保护**: 基础的访问控制和权限验证

### 3. 页面功能升级

#### 首页 (Hero Section)
```tsx
// 3D 背景效果 + 实验室简介动画展示
<HeroSection>
  <ParticleBackground />        {/* Three.js 粒子背景 */}
  <GeometricShapes />          {/* 动态几何图形 */}
  <AnimatedIntro />            {/* 打字机效果简介 */}
  <ResearchPreview />          {/* 研究成果预览 */}
</HeroSection>
```

#### 团队页面 (Team Page)
```tsx
// 教师网格 + 学生列表 + 详细信息弹窗
<TeamPage>
  <FacultyGrid />              {/* 教师卡片网格 */}
  <StudentList />              {/* 分年级学生列表 */}
  <MemberModal />              {/* 教师详细信息弹窗 */}
</TeamPage>
```

#### 研究页面 (Research Page)
```tsx
// 交互式研究方向展示 + 论文列表
<ResearchPage>
  <ResearchGrid />             {/* 研究方向卡片 */}
  <PaperTimeline />            {/* 论文时间线 */}
  <InteractiveDemo />          {/* 研究成果交互演示 */}
</ResearchPage>
```

#### 团建页面 (Team Building)
```tsx
// 3D 轮播效果 + 活动时间线
<TeamBuildingPage>
  <ThreeDCarousel />           {/* 3D 轮播图 */}
  <ActivityTimeline />         {/* 活动时间线 */}
  <PhotoGallery />            {/* 照片画廊 */}
</TeamBuildingPage>
```

#### 联系页面 (Contact Page)
```tsx
// 表单动画 + 地图集成 + 招募信息
<ContactPage>
  <AnimatedForm />            {/* 流畅表单动画 */}
  <RecruitmentCards />        {/* 招募信息卡片 */}
  <InteractiveMap />          {/* 实验室位置地图 */}
</ContactPage>
```

### 4. 性能优化策略

#### 前端性能优化
- **代码分割**: 按路由和组件进行代码分割
- **图片优化**: Next.js Image 组件 + WebP 格式
- **懒加载**: 组件和图片的懒加载实现
- **缓存策略**: 静态资源长期缓存 + API 响应缓存

#### SEO 和可访问性
- **动态元数据**: 每个页面生成 SEO 友好的元数据
- **结构化数据**: JSON-LD 格式的结构化数据
- **语义化标签**: 正确的 HTML 语义结构
- **键盘导航**: 完整键盘操作支持

#### 监控和分析
- **性能监控**: Web Vitals 指标监控
- **错误跟踪**: 错误边界和日志收集
- **用户分析**: 页面访问和用户行为分析
- **AI 效果评估**: 聊天质量和响应时间监控

## 部署配置

### 环境变量配置
```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://igame-lab.dasusm.com
DEEPSEEK_API_KEY=your_deepseek_api_key
OPENAI_API_KEY=your_openai_api_key_for_embeddings
REDIS_URL=redis://localhost:6379  # 可选
```

### Nginx 配置
```nginx
server {
    listen 80;
    server_name igame-lab.dasusm.com;

    # 静态资源缓存优化
    location /_next/static {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 路由代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 主应用代理
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SSL 配置 (生产环境)
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/igame-lab.dasusm.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/igame-lab.dasusm.com/privkey.pem;
}
```

### PM2 进程管理
```json
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'igame-lab-next',
    script: 'npm run start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

## 开发和维护计划

### Phase 1: 基础架构搭建 (1-2周)
- [ ] Next.js 项目初始化
- [ ] 基础组件库搭建
- [ ] 页面路由和布局实现
- [ ] TailwindCSS 样式系统配置

### Phase 2: 核心功能开发 (2-3周)
- [ ] 页面组件迁移和优化
- [ ] 动画效果和3D背景实现
- [ ] 响应式设计适配
- [ ] 性能优化实施

### Phase 3: AI 功能集成 (2-3周)
- [ ] DeepSeek API 集成
- [ ] ChromaDB 向量数据库配置
- [ ] RAG 系统实现
- [ ] 聊天界面开发

### Phase 4: 测试和部署 (1-2周)
- [ ] 功能测试和性能测试
- [ ] SEO 和可访问性优化
- [ ] DasuSM 部署配置
- [ ] 监控系统搭建

### Phase 5: 运维和优化 (持续)
- [ ] 用户反馈收集和功能迭代
- [ ] 内容更新和维护
- [ ] 性能监控和优化
- [ ] 安全更新和维护

## 技术创新点

### 1. AI 驱动的用户体验
- **智能问答**: 基于实验室知识库的智能对话
- **个性化推荐**: 根据用户兴趣推荐相关内容
- **内容生成**: AI 辅助的内容创作和更新

### 2. 沉浸式视觉体验
- **3D 交互**: Three.js 实现的3D背景和交互元素
- **物理动画**: Matter.js 实现的物理效果动画
- **流畅过渡**: 60fps 的流畅动画和页面切换

### 3. 现代化的开发体验
- **类型安全**: TypeScript 提供完整的类型检查
- **组件化**: 高度可复用的组件设计
- **自动化**: 现代化的构建和部署流程

## 预期效果

### 用户体验提升
- **加载速度**: 静态生成 + CDN 加速 < 2s
- **交互流畅**: 60fps 动画和即时反馈
- **内容丰富**: AI 助手提供个性化内容
- **移动友好**: 完美的移动端体验

### 技术指标
- **Lighthouse 评分**: 性能 > 90, 可访问性 > 95
- **Core Web Vitals**: 全部指标达到良好标准
- **SEO 排名**: 实验室相关关键词排名提升
- **用户留存**: 页面停留时间提升 200%

### 业务价值
- **学术交流**: 提升实验室学术影响力
- **人才吸引**: 现代化界面吸引优质人才
- **国际合作**: AI 助手支持多语言交流
- **科研展示**: 沉浸式展示研究成果

---

*升级方案制定时间: 2025年12月29日*  
*基于 Next.js 14 + AI 技术栈设计*
