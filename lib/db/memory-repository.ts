import { prisma } from './prisma';

// 记忆文档接口
export interface MemoryDocumentRecord {
  id: string;
  title: string;
  content: string;
  type: string;
  fileName?: string;
  chunkIndex: number;
  totalChunks: number;
  createdAt: Date;
  updatedAt: Date;
  pineconeId: string; // 对应的Pinecone向量ID
  status: 'active' | 'deleted'; // 文档状态
}

// 创建记忆文档记录
export async function createMemoryDocument(doc: Omit<MemoryDocumentRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> {
  try {
    const memoryDoc = await prisma.memoryDocument.create({
      data: {
        title: doc.title,
        content: doc.content,
        type: doc.type,
        fileName: doc.fileName,
        chunkIndex: doc.chunkIndex,
        totalChunks: doc.totalChunks,
        pineconeId: doc.pineconeId,
        status: 'active',
      },
    });

    console.log(`Memory document created in database: ${memoryDoc.id}`);
    return memoryDoc.id;
  } catch (error) {
    // 如果数据库不可用，记录警告但不抛出错误
    console.warn('Database unavailable for createMemoryDocument:', error instanceof Error ? error.message : 'Unknown error');
    // 返回一个虚拟ID表示保存失败，但不影响Pinecone保存
    return `db_unavailable_${Date.now()}`;
  }
}

// 获取所有记忆文档
export async function getAllMemoryDocuments(): Promise<MemoryDocumentRecord[]> {
  try {
    const documents = await prisma.memoryDocument.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
    });

    return documents.map(doc => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      type: doc.type,
      fileName: doc.fileName || undefined,
      chunkIndex: doc.chunkIndex,
      totalChunks: doc.totalChunks,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      pineconeId: doc.pineconeId,
      status: doc.status,
    }));
  } catch (error) {
    // 如果数据库不可用，返回空数组，让调用方处理降级
    console.warn('Database unavailable for getAllMemoryDocuments:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

// 根据ID获取记忆文档
export async function getMemoryDocumentById(id: string): Promise<MemoryDocumentRecord | null> {
  try {
    const document = await prisma.memoryDocument.findUnique({
      where: { id, status: 'active' },
    });

    if (!document) {
      return null;
    }

    return {
      id: document.id,
      title: document.title,
      content: document.content,
      type: document.type,
      fileName: document.fileName || undefined,
      chunkIndex: document.chunkIndex,
      totalChunks: document.totalChunks,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      pineconeId: document.pineconeId,
      status: document.status,
    };
  } catch (error) {
    console.warn('Database unavailable for getMemoryDocumentById:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

// 根据Pinecone ID获取记忆文档
export async function getMemoryDocumentByPineconeId(pineconeId: string): Promise<MemoryDocumentRecord | null> {
  try {
    const document = await prisma.memoryDocument.findUnique({
      where: { pineconeId },
    });

    if (!document || document.status !== 'active') {
      return null;
    }

    return {
      id: document.id,
      title: document.title,
      content: document.content,
      type: document.type,
      fileName: document.fileName || undefined,
      chunkIndex: document.chunkIndex,
      totalChunks: document.totalChunks,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      pineconeId: document.pineconeId,
      status: document.status,
    };
  } catch (error) {
    console.error('Failed to get memory document by Pinecone ID:', error);
    return null;
  }
}

// 删除记忆文档（软删除）
export async function deleteMemoryDocument(id: string): Promise<boolean> {
  try {
    const result = await prisma.memoryDocument.update({
      where: { id },
      data: { status: 'deleted' },
    });

    if (result) {
      console.log(`Memory document marked as deleted: ${id}`);
      return true;
    }

    return false;
  } catch (error) {
    // 如果数据库不可用，记录警告但返回false（表示删除失败）
    console.warn('Database unavailable for deleteMemoryDocument:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

// 硬删除记忆文档（物理删除）
export async function hardDeleteMemoryDocument(id: string): Promise<boolean> {
  try {
    const result = await prisma.memoryDocument.delete({
      where: { id },
    });

    console.log(`Memory document permanently deleted: ${id}`);
    return !!result;
  } catch (error) {
    console.error('Failed to hard delete memory document:', error);
    return false;
  }
}

// 获取文档统计信息
export async function getMemoryStats(): Promise<{
  total: number;
  active: number;
  deleted: number;
  byType: Record<string, number>;
}> {
  try {
    // 使用 Prisma 进行统计查询
    const [totalResult, activeResult, deletedResult, typeResults] = await Promise.all([
      prisma.memoryDocument.count(),
      prisma.memoryDocument.count({ where: { status: 'active' } }),
      prisma.memoryDocument.count({ where: { status: 'deleted' } }),
      prisma.memoryDocument.groupBy({
        by: ['type'],
        where: { status: 'active' },
        _count: { type: true },
      })
    ]);

    const byType: Record<string, number> = {};
    typeResults.forEach((result) => {
      byType[result.type] = result._count.type;
    });

    return {
      total: totalResult,
      active: activeResult,
      deleted: deletedResult,
      byType,
    };
  } catch (error) {
    console.error('Failed to get memory stats:', error);
    // 返回默认值
    return {
      total: 0,
      active: 0,
      deleted: 0,
      byType: {},
    };
  }
}

// 搜索记忆文档（按标题和内容）
export async function searchMemoryDocuments(searchTerm: string, limit: number = 20): Promise<MemoryDocumentRecord[]> {
  try {
    const documents = await prisma.memoryDocument.findMany({
      where: {
        status: 'active',
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { content: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return documents.map(doc => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      type: doc.type,
      fileName: doc.fileName || undefined,
      chunkIndex: doc.chunkIndex,
      totalChunks: doc.totalChunks,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      pineconeId: doc.pineconeId,
      status: doc.status,
    }));
  } catch (error) {
    console.error('Failed to search memory documents:', error);
    return [];
  }
}
