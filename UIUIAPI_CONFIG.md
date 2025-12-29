# uiuiapi 配置指南

## 概述

本项目支持使用 uiuiapi 作为 OpenAI API 的第三方提供商。uiuiapi 提供与 OpenAI API 兼容的接口，可以无缝集成到现有的 AI 功能中。

## 配置步骤

### 1. 获取 uiuiapi API 密钥

1. 访问 [uiuiapi](https://uiuiapi.com) 注册账号
2. 在控制台获取您的 API 密钥
3. 确认账户有足够的余额

### 2. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# OpenAI API配置 (使用uiuiapi)
OPENAI_API_KEY=sk-your-uiuiapi-key-here
OPENAI_API_BASE_URL=https://api.uiuiapi.com/v1

# DeepSeek API (可选，用于其他功能)
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### 3. uiuiapi API 端点

根据 uiuiapi 的官方文档，API 端点通常是：
- `https://api.uiuiapi.com/v1` (推荐)
- 或其他 uiuiapi 提供的端点

请根据 uiuiapi 的最新文档确认正确的端点地址。

## 支持的功能

### 聊天功能
- 支持 GPT-3.5-turbo 模型
- 实时对话
- 基于 RAG 的智能回答

### 向量嵌入
- 支持 text-embedding-3-small 模型
- 用于文档向量化存储
- 智能内容检索

## 故障排除

### 常见问题

1. **API 密钥无效**
   ```
   错误: API error: 401
   解决: 检查 OPENAI_API_KEY 是否正确
   ```

2. **API 端点错误**
   ```
   错误: Failed to connect
   解决: 确认 OPENAI_API_BASE_URL 格式正确
   ```

3. **余额不足**
   ```
   错误: API error: 429
   解决: 检查 uiuiapi 账户余额
   ```

4. **模型不支持**
   ```
   错误: model not found
   解决: 确认 uiuiapi 支持 text-embedding-3-small 模型
   ```

### 调试方法

1. 检查环境变量是否正确加载
2. 查看控制台错误日志
3. 测试 API 连接：
   ```bash
   curl -X POST https://api.uiuiapi.com/v1/embeddings \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -d '{"input": "test", "model": "text-embedding-3-small"}'
   ```

## 价格和限制

- 根据 uiuiapi 的定价策略付费
- 注意 API 调用频率限制
- 监控账户余额避免服务中断

## 环境变量配置示例

创建 `.env.local` 文件的完整示例：

```bash
# DeepSeek API配置 (可选)
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# OpenAI API配置 (使用uiuiapi)
OPENAI_API_KEY=sk-your-uiuiapi-key-here
OPENAI_API_BASE_URL=https://api.uiuiapi.com/v1

# 数据库配置
CHROMA_DB_PATH=./data/chroma

# 可选配置
REDIS_URL=redis://localhost:6379
```

## 切换回官方 OpenAI API

如果需要切换回官方 OpenAI API，只需修改环境变量：

```bash
OPENAI_API_KEY=sk-your-official-openai-key
OPENAI_API_BASE_URL=https://api.openai.com/v1
```

---

*最后更新：2025年12月29日*
