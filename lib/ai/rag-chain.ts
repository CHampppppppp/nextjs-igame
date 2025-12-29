import { Pinecone } from '@pinecone-database/pinecone';
import { generateEmbeddings } from './embeddings';

export interface MemoryDocument {
  id: string;
  content: string;
  metadata: {
    title?: string;
    type?: string;
    createdAt: string;
    fileName?: string;
    chunkIndex?: number;
    totalChunks?: number;
  };
}

// Pinecone向量存储实现
export class PineconeVectorStore {
  private pinecone: Pinecone;
  private indexName: string;

  constructor() {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
      throw new Error('PINECONE_API_KEY environment variable is not set');
    }

    this.pinecone = new Pinecone({
      apiKey: apiKey,
    });

    this.indexName = process.env.PINECONE_INDEX_NAME || 'igame-lab-memory';
  }

  async addDocument(document: MemoryDocument): Promise<void> {
    try {
      const index = this.pinecone.index(this.indexName);

      // 生成文档内容的向量嵌入
      const embedding = await generateEmbeddings(document.content);

      // 准备向量数据
      const vector = {
        id: document.id,
        values: embedding,
        metadata: {
          content: document.content,
          title: document.metadata.title || '',
          type: document.metadata.type || '',
          createdAt: document.metadata.createdAt,
          fileName: document.metadata.fileName || '',
          chunkIndex: document.metadata.chunkIndex || 0,
          totalChunks: document.metadata.totalChunks || 1,
        }
      };

      // 存储到Pinecone
      await index.upsert([vector]);
      console.log(`Document ${document.id} added to Pinecone index`);
    } catch (error) {
      console.error('Error adding document to Pinecone:', error);
      throw error;
    }
  }

  async searchRelevantDocuments(query: string, limit: number = 5): Promise<MemoryDocument[]> {
    try {
      const index = this.pinecone.index(this.indexName);

      // 生成查询的向量嵌入
      const queryEmbedding = await generateEmbeddings(query);

      // 在Pinecone中搜索相似向量
      const searchResponse = await index.query({
        vector: queryEmbedding,
        topK: limit,
        includeMetadata: true,
        includeValues: false,
      });

      // 转换搜索结果为MemoryDocument格式
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
      console.error('Error searching documents in Pinecone:', error);
      throw error;
    }
  }

  async getAllDocuments(): Promise<MemoryDocument[]> {
    try {
      const index = this.pinecone.index(this.indexName);

      // 获取所有向量（注意：这在生产环境中可能不是最佳实践，因为Pinecone没有直接的"获取所有"API）
      // 这里我们使用一个大的topK值来模拟获取所有文档
      const stats = await index.describeIndexStats();
      const totalVectors = stats.totalVectorCount || 0;

      if (totalVectors === 0) {
        return [];
      }

      // 使用一个零向量来获取所有文档（这不是最优的方法，但在Pinecone中没有直接的list all API）
      const zeroVector = new Array(1536).fill(0); // text-embedding-3-small的维度是1536

      const searchResponse = await index.query({
        vector: zeroVector,
        topK: Math.min(totalVectors, 10000), // 限制最大数量
        includeMetadata: true,
        includeValues: false,
      });

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
      console.error('Error getting all documents from Pinecone:', error);
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

// 保留向后兼容的内存向量存储实现（作为备用）
export class SimpleVectorStore {
  private documents: MemoryDocument[] = [];

  async addDocument(document: MemoryDocument): Promise<void> {
    this.documents.push(document);
    console.log(`Document ${document.id} added to memory store`);
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

export class RAGSystem {
  private vectorStore: PineconeVectorStore | SimpleVectorStore;

  constructor() {
    // 检查是否配置了Pinecone，如果没有则使用内存存储作为备用
    const pineconeApiKey = process.env.PINECONE_API_KEY;

    if (pineconeApiKey) {
      try {
        this.vectorStore = new PineconeVectorStore();
        console.log('Using Pinecone vector store');
      } catch (error) {
        console.warn('Failed to initialize Pinecone, falling back to memory store:', error);
        this.vectorStore = new SimpleVectorStore();
      }
    } else {
      console.log('PINECONE_API_KEY not configured, using memory vector store');
      this.vectorStore = new SimpleVectorStore();
    }
  }

  async addDocument(document: MemoryDocument): Promise<void> {
    await this.vectorStore.addDocument(document);
  }

  async searchRelevantDocuments(query: string, limit: number = 5): Promise<MemoryDocument[]> {
    return await this.vectorStore.searchRelevantDocuments(query, limit);
  }

  async getAllDocuments(): Promise<MemoryDocument[]> {
    return await this.vectorStore.getAllDocuments();
  }

  async deleteDocument(documentId: string): Promise<void> {
    await this.vectorStore.deleteDocument(documentId);
  }
}

export const ragSystem = new RAGSystem();
