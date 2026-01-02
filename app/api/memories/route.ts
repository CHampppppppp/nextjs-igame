import { NextRequest, NextResponse } from 'next/server';
import { ragSystem } from '@/lib/ai/rag-chain';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getAllMemoryDocuments, deleteMemoryDocument, getMemoryDocumentById } from '@/lib/db/memory-repository';

export async function GET() {
  try {
    // 从数据库获取所有记忆文档
    const dbDocuments = await getAllMemoryDocuments();

    // 转换为前端期望的格式
    const documents = dbDocuments.map(doc => ({
      id: doc.id,
      content: doc.content,
      metadata: {
        title: doc.title,
        type: doc.type,
        createdAt: doc.createdAt.toISOString(),
        fileName: doc.fileName,
        chunkIndex: doc.chunkIndex,
        totalChunks: doc.totalChunks,
      }
    }));

    console.log(`Retrieved ${documents.length} memory documents from database`);
    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Get memories error:', error);

    // 如果数据库查询失败，尝试从Pinecone获取作为fallback
    try {
      console.log('Attempting fallback to Pinecone...');
      const documents = await ragSystem.getAllDocuments();
      return NextResponse.json({
        documents,
        warning: 'Retrieved from Pinecone (database unavailable)'
      });
    } catch (fallbackError) {
      console.error('Fallback to Pinecone also failed:', fallbackError);
      return NextResponse.json(
        { error: 'Failed to retrieve memory documents from both database and Pinecone' },
        { status: 500 }
      );
    }
  }
}

// 异步删除处理函数
async function performAsyncDeletion(documentId: string) {
  try {
    console.log(`[Async] Starting deletion of memory document: ${documentId}`);

    // 1. 从数据库获取文档信息（包括pineconeIds）
    const document = await getMemoryDocumentById(documentId);
    if (!document) {
      console.warn(`[Async] Document not found in database: ${documentId}`);
      return;
    }

    // 2. 删除所有相关的Pinecone记录
    if (document.pineconeId) {
      const pineconeIds = document.pineconeId.split(',');
      for (const pineconeId of pineconeIds) {
        try {
          await ragSystem.deleteDocument(pineconeId.trim());
          console.log(`[Async] ✓ Deleted chunk from Pinecone: ${pineconeId}`);
        } catch (pineconeError) {
          console.warn(`[Async] ⚠️ Failed to delete chunk from Pinecone: ${pineconeId}`, pineconeError);
        }
      }
    }

    // 3. 从数据库删除（硬删除）
    const dbDeleted = await deleteMemoryDocument(documentId);
    if (dbDeleted) {
      console.log(`[Async] ✓ Hard deleted document from database: ${documentId}`);
    } else {
      console.warn(`[Async] ⚠️ Document not found in database for hard deletion: ${documentId}`);
    }

    // 4. 删除本地文件（如果存在）
    try {
      const memoriesDir = path.join(process.cwd(), 'data', 'memories');
      const files = await fs.readdir(memoriesDir).catch(() => []);
      const fileToDelete = files.find(file => file.startsWith(documentId));

      if (fileToDelete) {
        await fs.unlink(path.join(memoriesDir, fileToDelete));
        console.log(`[Async] ✓ Deleted local file: ${fileToDelete}`);
      }
    } catch (fileError) {
      console.warn(`[Async] ⚠️ Failed to delete local file: ${fileError}`);
    }

    console.log(`[Async] Completed deletion of memory document: ${documentId}`);
  } catch (error) {
    console.error('[Async] Error during async deletion:', error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { documentId } = await request.json();

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    console.log(`Initiating deletion of memory document: ${documentId}`);

    // 立即返回成功响应，让前端感觉很快
    // 注意：此时还没有真正删除，后端会在后台慢慢处理
    const response = NextResponse.json({
      success: true,
      message: 'Document deletion initiated successfully'
    });

    // 在后台异步执行实际删除操作
    setImmediate(() => {
      performAsyncDeletion(documentId);
    });

    return response;
  } catch (error) {
    console.error('Delete memory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


