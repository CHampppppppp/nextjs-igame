/**
 * RAG（检索增强生成）系统核心模块
 * 负责管理向量数据库的文档存储、检索和删除操作
 *
 * 主要功能：
 * - 文档向量化存储到 Pinecone
 * - 基于语义相似度的文档检索
 * - 文档生命周期管理
 */

import { Pinecone } from '@pinecone-database/pinecone';
import { generateEmbeddings } from './embeddings';

/**
 * 记忆文档接口定义
 * 表示系统中存储的一个文档片段
 */
export interface MemoryDocument {
  /** 文档唯一标识符 */
  id: string;
  /** 文档内容文本 */
  content: string;
  /** 文档元数据信息 */
  metadata: {
    /** 文档标题 */
    title?: string;
    /** 文档类型（如：research, news, team等） */
    type?: string;
    /** 创建时间 */
    createdAt: string;
    /** 源文件名称 */
    fileName?: string;
    /** 在原文档中的分块索引 */
    chunkIndex?: number;
    /** 原文档的总分块数量 */
    totalChunks?: number;
  };
}

/**
 * Pinecone向量存储实现类
 * 负责与Pinecone向量数据库的交互操作
 */
export class PineconeVectorStore {
  /** Pinecone客户端实例 */
  private pinecone: Pinecone;
  /** 向量索引名称 */
  private indexName: string;

  constructor() {
    // 检查必需的环境变量
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
      throw new Error('PINECONE_API_KEY 环境变量未设置，请配置Pinecone API密钥');
    }

    // 初始化Pinecone客户端
    this.pinecone = new Pinecone({
      apiKey: apiKey,
    });

    // 设置索引名称，默认使用igame-lab-memory
    this.indexName = process.env.PINECONE_INDEX_NAME || 'igame-lab-memory';
  }

  /**
   * 添加文档到向量数据库
   * 将文档内容转换为向量嵌入并存储到Pinecone
   *
   * @param document 要存储的记忆文档
   * @throws 当向量化或存储失败时抛出错误
   */
  async addDocument(document: MemoryDocument): Promise<void> {
    try {
      // 获取Pinecone索引实例
      const index = this.pinecone.index(this.indexName);

      // 将文档内容转换为向量嵌入（使用OpenAI的text-embedding-3-small模型）
      const embedding = await generateEmbeddings(document.content);

      // 构建向量数据结构
      const vector = {
        id: document.id,
        values: embedding, // 1536维向量
        metadata: {
          content: document.content, // 原始文档内容
          title: document.metadata.title || '',
          type: document.metadata.type || '',
          createdAt: document.metadata.createdAt,
          fileName: document.metadata.fileName || '',
          chunkIndex: document.metadata.chunkIndex || 0,
          totalChunks: document.metadata.totalChunks || 1,
        }
      };

      // 将向量数据上传到Pinecone索引
      await index.upsert([vector]);
      console.log(`文档 ${document.id} 已添加到Pinecone索引`);
    } catch (error) {
      console.error('添加文档到Pinecone时出错:', error);
      throw error;
    }
  }

  /**
   * 搜索相关文档
   * 基于语义相似度从向量数据库中检索相关文档
   *
   * @param query 用户查询文本
   * @param limit 返回的最大文档数量，默认为5
   * @returns 返回按相关度排序的文档数组
   */
  async searchRelevantDocuments(query: string, limit: number = 5): Promise<MemoryDocument[]> {
    try {
      const index = this.pinecone.index(this.indexName);

      // 将查询文本转换为向量嵌入
      const queryEmbedding = await generateEmbeddings(query);

      // 在Pinecone中执行向量相似度搜索
      const searchResponse = await index.query({
        vector: queryEmbedding,      // 查询向量
        topK: limit,                 // 返回最相似的K个结果
        includeMetadata: true,       // 包含元数据
        includeValues: false,        // 不包含向量值（节省带宽）
      });

      // 将搜索结果转换为MemoryDocument格式
      const documents: MemoryDocument[] = searchResponse.matches.map(match => ({
        id: match.id,
        content: match.metadata?.content as string || '',
        metadata: {
          title: match.metadata?.title as string || '',
          type: match.metadata?.type as string || '',
          createdAt: match.metadata?.createdAt as string || '',
          fileName: match.metadata?.fileName as string || '',
          chunkIndex: match.metadata?.chunkIndex as number || 0,
          totalChunks: match.metadata?.totalChunks as number || 1,
        }
      }));

      return documents;
    } catch (error) {
      console.error('在Pinecone中搜索文档时出错:', error);
      throw error;
    }
  }

  async getAllDocuments(): Promise<MemoryDocument[]> {
    try {
      const index = this.pinecone.index(this.indexName);

      // 获取索引统计信息
      const stats = await index.describeIndexStats();
      const totalVectors = stats.totalRecordCount || 0;

      console.log(`Pinecone index stats: ${totalVectors} vectors, dimension: ${stats.dimension}`);

      if (totalVectors === 0) {
        return [];
      }

      // Pinecone没有直接的"获取所有"API，这是最佳的替代方案
      // 使用多种查询策略来最大化检索覆盖率

      let allDocuments: MemoryDocument[] = [];
      const processedIds = new Set<string>();

      // 策略1: 使用多个不同的查询向量来覆盖更广的范围
      const dimension = stats.dimension || 768; // 默认维度

      const queryStrategies = [
        // 零向量 - 理论上应该匹配所有向量
        { name: 'zero', vector: new Array(dimension).fill(0) },
        // 小的随机向量 - 增加多样性
        { name: 'random1', vector: Array.from({ length: dimension }, () => (Math.random() - 0.5) * 0.01) },
        { name: 'random2', vector: Array.from({ length: dimension }, () => (Math.random() - 0.5) * 0.01) },
        // 模式化向量 - 可能匹配特定分布的向量
        { name: 'pattern1', vector: Array.from({ length: dimension }, (_, i) => Math.sin(i * 0.01)) },
        { name: 'pattern2', vector: Array.from({ length: dimension }, (_, i) => Math.cos(i * 0.01)) },
      ];

      for (const strategy of queryStrategies) {
        if (allDocuments.length >= totalVectors) break; // 已经获取了所有文档

        try {
          console.log(`Trying query strategy: ${strategy.name}`);

          const searchResponse = await index.query({
            vector: strategy.vector,
            topK: Math.min(1000, totalVectors), // 获取尽可能多的文档
            includeMetadata: true,
            includeValues: false,
          });

          console.log(`Strategy ${strategy.name} found ${searchResponse.matches.length} matches`);

          // 处理搜索结果
          for (const match of searchResponse.matches) {
            if (!processedIds.has(match.id)) {
              processedIds.add(match.id);

              const document: MemoryDocument = {
                id: match.id,
                content: match.metadata?.content as string || '',
                metadata: {
                  title: match.metadata?.title as string || '',
                  type: match.metadata?.type as string || '',
                  createdAt: match.metadata?.createdAt as string || '',
                  fileName: match.metadata?.fileName as string || '',
                  chunkIndex: match.metadata?.chunkIndex as number || 0,
                  totalChunks: match.metadata?.totalChunks as number || 1,
                }
              };

              allDocuments.push(document);
            }
          }

        } catch (error) {
          console.warn(`Query strategy ${strategy.name} failed:`, error);
        }
      }

      // 最终去重（以防万一）
      const uniqueDocuments = allDocuments.filter((doc, index, self) =>
        index === self.findIndex(d => d.id === doc.id)
      );

      console.log(`Successfully retrieved ${uniqueDocuments.length} out of ${totalVectors} documents`);

      // 如果仍然没有获取到足够多的文档，给出警告
      if (uniqueDocuments.length === 0) {
        console.error('CRITICAL: Unable to retrieve any documents from Pinecone');
        console.error('This may indicate:');
        console.error('1. Index dimension mismatch');
        console.error('2. Vector encoding issues');
        console.error('3. Index corruption');
        console.error('4. API permissions problem');
      } else if (uniqueDocuments.length < totalVectors) {
        console.warn(`WARNING: Only retrieved ${uniqueDocuments.length} out of ${totalVectors} documents`);
        console.warn('Some documents may not be accessible due to query limitations');
      }

      return uniqueDocuments;

    } catch (error) {
      console.error('Error getting all documents from Pinecone:', error);

      // 如果是权限或连接问题，给出更具体的错误信息
      if (error instanceof Error) {
        if (error.message.includes('Unauthorized')) {
          console.error('API key may not have sufficient permissions');
        } else if (error.message.includes('not found')) {
          console.error('Index may not exist or name may be incorrect');
        }
      }

      throw error;
    }
  }

  async deleteDocument(documentId: string): Promise<void> {
    try {
      const index = this.pinecone.index(this.indexName);
      await index.deleteOne(documentId);
      console.log(`Document ${documentId} deleted from Pinecone index`);
    } catch (error) {
      console.error('Error deleting document from Pinecone:', error);
      throw error;
    }
  }

  async clearAllDocuments(): Promise<void> {
    try {
      // 注意：Pinecone没有直接的清空索引API，这里我们通过删除和重建索引来实现
      // 但这需要管理员权限，在实际应用中可能需要不同的策略
      console.warn('Clearing all documents from Pinecone index - this requires index recreation');
      // 这里暂时不实现，因为需要管理员权限
    } catch (error) {
      console.error('Error clearing documents from Pinecone:', error);
      throw error;
    }
  }
}

/**
 * 简化的内存向量存储实现（仅用于开发测试）
 * 注意：此实现不进行真正的向量化，仅基于关键词匹配
 * 生产环境应使用 PineconeVectorStore
 */
export class SimpleVectorStore {
  /** 存储在内存中的文档数组 */
  private documents: MemoryDocument[] = [];

  /**
   * 添加文档到内存存储
   * @param document 要添加的文档
   */
  async addDocument(document: MemoryDocument): Promise<void> {
    this.documents.push(document);
    console.log(`文档 ${document.id} 已添加到内存存储`);
  }

  async searchRelevantDocuments(query: string, limit: number = 5): Promise<MemoryDocument[]> {
    // 简单的基于关键词的搜索（生产环境应该使用真正的向量相似度）
    const queryLower = query.toLowerCase();
    const scoredDocs = this.documents
      .map(doc => ({
        doc,
        score: this.calculateRelevanceScore(doc.content.toLowerCase(), queryLower)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scoredDocs.map(item => item.doc);
  }

  private calculateRelevanceScore(content: string, query: string): number {
    const words = query.split(/\s+/);
    let score = 0;

    for (const word of words) {
      if (word.length < 2) continue; // 跳过太短的词

      // 精确匹配
      const exactMatches = (content.match(new RegExp(word, 'g')) || []).length;
      score += exactMatches * 3;

      // 部分匹配
      if (content.includes(word)) {
        score += 1;
      }
    }

    return score;
  }

  async getAllDocuments(): Promise<MemoryDocument[]> {
    return [...this.documents];
  }

  async deleteDocument(documentId: string): Promise<void> {
    const index = this.documents.findIndex(doc => doc.id === documentId);
    if (index !== -1) {
      this.documents.splice(index, 1);
      console.log(`Document ${documentId} deleted from memory store`);
    }
  }
}

/**
 * RAG（检索增强生成）系统主控制器
 * 统一管理向量存储的后端实现，优先使用Pinecone
 */
export class RAGSystem {
  /** 向量存储实例（Pinecone或内存备用） */
  private vectorStore: PineconeVectorStore | SimpleVectorStore;

  constructor() {
    // 检查必需的Pinecone配置
    const pineconeApiKey = process.env.PINECONE_API_KEY;

    if (!pineconeApiKey) {
      throw new Error('需要配置 PINECONE_API_KEY 环境变量才能使用记忆功能。请先配置Pinecone API密钥。');
    }

    try {
      // 初始化Pinecone向量存储
      this.vectorStore = new PineconeVectorStore();
      console.log('正在使用Pinecone向量存储');
    } catch (error) {
      console.error('Pinecone初始化失败:', error);
      throw new Error(`Pinecone初始化失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 添加文档到向量存储
   * @param document 要添加的记忆文档
   */
  async addDocument(document: MemoryDocument): Promise<void> {
    await this.vectorStore.addDocument(document);
  }

  /**
   * 搜索相关文档
   * @param query 查询文本
   * @param limit 返回文档数量限制
   * @returns 相关文档数组
   */
  async searchRelevantDocuments(query: string, limit: number = 5): Promise<MemoryDocument[]> {
    return await this.vectorStore.searchRelevantDocuments(query, limit);
  }

  /**
   * 获取所有文档
   * @returns 所有存储的文档数组
   */
  async getAllDocuments(): Promise<MemoryDocument[]> {
    return await this.vectorStore.getAllDocuments();
  }

  /**
   * 删除指定文档
   * @param documentId 要删除的文档ID
   */
  async deleteDocument(documentId: string): Promise<void> {
    await this.vectorStore.deleteDocument(documentId);
  }
}

/**
 * RAG系统全局实例
 * 整个应用共享的RAG系统实例，用于文档检索和记忆管理
 */
export const ragSystem = new RAGSystem();
