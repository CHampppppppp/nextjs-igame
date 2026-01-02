import { query } from './mysql';

// 记忆文档接口
export interface MemoryDocumentRecord {
  id: string;
  title: string;
  content: string;
  type: string;
  fileName: string;
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
    const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const sql = `
      INSERT INTO memory_documents (
        id, title, content, type, file_name, chunk_index, total_chunks,
        created_at, updated_at, pinecone_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, 'active')
    `;

    const params = [
      id,
      doc.title,
      doc.content,
      doc.type,
      doc.fileName,
      doc.chunkIndex,
      doc.totalChunks,
      doc.pineconeId
    ];

    await query(sql, params);
    console.log(`Memory document created in database: ${id}`);
    return id;
  } catch (error) {
    // 如果数据库不可用，记录警告但不抛出错误
    console.warn('MySQL database unavailable for createMemoryDocument:', error instanceof Error ? error.message : 'Unknown error');
    // 返回一个虚拟ID表示保存失败，但不影响Pinecone保存
    return `db_unavailable_${Date.now()}`;
  }
}

// 获取所有记忆文档
export async function getAllMemoryDocuments(): Promise<MemoryDocumentRecord[]> {
  try {
    const sql = `
      SELECT
        id, title, content, type, file_name as fileName,
        chunk_index as chunkIndex, total_chunks as totalChunks,
        created_at as createdAt, updated_at as updatedAt,
        pinecone_id as pineconeId, status
      FROM memory_documents
      WHERE status = 'active'
      ORDER BY created_at DESC
    `;

    const rows = await query(sql);

    // 转换日期字符串为Date对象
    return rows.map((row: any) => ({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  } catch (error) {
    // 如果数据库不可用，返回空数组，让调用方处理降级
    console.warn('MySQL database unavailable for getAllMemoryDocuments:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

// 根据ID获取记忆文档
export async function getMemoryDocumentById(id: string): Promise<MemoryDocumentRecord | null> {
  const sql = `
    SELECT
      id, title, content, type, file_name as fileName,
      chunk_index as chunkIndex, total_chunks as totalChunks,
      created_at as createdAt, updated_at as updatedAt,
      pinecone_id as pineconeId, status
    FROM memory_documents
    WHERE id = ? AND status = 'active'
  `;

  const rows = await query(sql, [id]);

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  return {
    ...row,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

// 根据Pinecone ID获取记忆文档
export async function getMemoryDocumentByPineconeId(pineconeId: string): Promise<MemoryDocumentRecord | null> {
  const sql = `
    SELECT
      id, title, content, type, file_name as fileName,
      chunk_index as chunkIndex, total_chunks as totalChunks,
      created_at as createdAt, updated_at as updatedAt,
      pinecone_id as pineconeId, status
    FROM memory_documents
    WHERE pinecone_id = ? AND status = 'active'
  `;

  const rows = await query(sql, [pineconeId]);

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  return {
    ...row,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

// 删除记忆文档（软删除）
export async function deleteMemoryDocument(id: string): Promise<boolean> {
  try {
    const sql = `
      UPDATE memory_documents
      SET status = 'deleted', updated_at = NOW()
      WHERE id = ?
    `;

    const result = await query(sql, [id]);
    const affectedRows = (result as any).affectedRows || 0;

    if (affectedRows > 0) {
      console.log(`Memory document marked as deleted: ${id}`);
      return true;
    }

    return false;
  } catch (error) {
    // 如果数据库不可用，记录警告但返回false（表示删除失败）
    console.warn('MySQL database unavailable for deleteMemoryDocument:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

// 硬删除记忆文档（物理删除）
export async function hardDeleteMemoryDocument(id: string): Promise<boolean> {
  const sql = `DELETE FROM memory_documents WHERE id = ?`;

  const result = await query(sql, [id]);
  const affectedRows = (result as any).affectedRows || 0;

  if (affectedRows > 0) {
    console.log(`Memory document permanently deleted: ${id}`);
    return true;
  }

  return false;
}

// 获取文档统计信息
export async function getMemoryStats(): Promise<{
  total: number;
  active: number;
  deleted: number;
  byType: Record<string, number>;
}> {
  // 总数统计
  const totalSql = `SELECT COUNT(*) as count FROM memory_documents`;
  const activeSql = `SELECT COUNT(*) as count FROM memory_documents WHERE status = 'active'`;
  const deletedSql = `SELECT COUNT(*) as count FROM memory_documents WHERE status = 'deleted'`;

  // 类型统计
  const typeSql = `
    SELECT type, COUNT(*) as count
    FROM memory_documents
    WHERE status = 'active'
    GROUP BY type
  `;

  const [totalResult] = await query(totalSql);
  const [activeResult] = await query(activeSql);
  const [deletedResult] = await query(deletedSql);
  const typeResults = await query(typeSql);

  const byType: Record<string, number> = {};
  typeResults.forEach((row: any) => {
    byType[row.type] = row.count;
  });

  return {
    total: totalResult.count,
    active: activeResult.count,
    deleted: deletedResult.count,
    byType,
  };
}

// 搜索记忆文档（按标题和内容）
export async function searchMemoryDocuments(searchTerm: string, limit: number = 20): Promise<MemoryDocumentRecord[]> {
  const sql = `
    SELECT
      id, title, content, type, file_name as fileName,
      chunk_index as chunkIndex, total_chunks as totalChunks,
      created_at as createdAt, updated_at as updatedAt,
      pinecone_id as pineconeId, status
    FROM memory_documents
    WHERE status = 'active'
    AND (title LIKE ? OR content LIKE ?)
    ORDER BY created_at DESC
    LIMIT ?
  `;

  const searchPattern = `%${searchTerm}%`;
  const rows = await query(sql, [searchPattern, searchPattern, limit]);

  return rows.map((row: any) => ({
    ...row,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  }));
}
