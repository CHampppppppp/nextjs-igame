# Pinecone 设置指南

本项目已迁移到使用Pinecone作为云向量存储库。

## 环境变量配置

在你的 `.env` 文件中添加以下环境变量：

```bash
# OpenAI API 配置（用于生成向量嵌入）
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_API_BASE_URL=https://api.openai.com/v1

# Pinecone 配置
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=igame-lab-memory
```

## Pinecone 设置步骤

1. **注册Pinecone账户**
   - 访问 [Pinecone官网](https://www.pinecone.io/)
   - 创建账户并登录

2. **获取API密钥**
   - 在Pinecone控制台中创建API密钥
   - 将密钥添加到环境变量 `PINECONE_API_KEY`

3. **创建索引**
   - 在Pinecone控制台中创建一个新索引
   - 索引名称：`igame-lab-memory`（或你在环境变量中设置的名称）
   - 维度：1536（因为使用text-embedding-3-small模型）
   - 度量：cosine

4. **测试连接**
   - 运行应用程序
   - 检查控制台日志确认Pinecone连接成功

## 向后兼容性

如果没有配置Pinecone环境变量，系统会自动回退到内存向量存储（SimpleVectorStore）作为备用方案。

## 故障排除

- 确保OpenAI API密钥正确且有足够的使用额度
- 确认Pinecone索引维度设置为1536
- 检查网络连接是否正常
- 查看应用程序日志中的错误信息
