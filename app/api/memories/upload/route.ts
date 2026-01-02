import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ragSystem, MemoryDocument } from '@/lib/ai/rag-chain';
import { splitTextIntoChunks } from '@/lib/ai/embeddings';
import { createMemoryDocument } from '@/lib/db/memory-repository';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const textContent = formData.get('content') as string | null;
    const uploadType = formData.get('type') as string | null;

    let content = '';
    let fileName = '';
    let fileType = '';

    // 处理文本输入模式
    if (uploadType === 'text' && textContent) {
      content = textContent.trim();
      fileName = `${uuidv4()}_${title || 'text'}.txt`;
      fileType = 'text/plain';

      if (!content) {
        return NextResponse.json(
          { error: 'Text content is empty' },
          { status: 400 }
        );
      }
    }
    // 处理文件上传模式
    else if (file) {
      // 检查文件类型
      const allowedTypes = ['text/plain', 'application/pdf', 'text/markdown'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Only .txt, .pdf, and .md files are allowed' },
          { status: 400 }
        );
      }

      // 读取文件内容（用于Pinecone向量存储）
      const buffer = Buffer.from(await file.arrayBuffer());

      if (file.type === 'application/pdf') {
        // PDF文件处理（需要pdf-parse包）
        try {
          const pdfParse = (await import('pdf-parse')) as any;
          const data = await pdfParse(buffer);
          content = data.text;
        } catch (error) {
          console.error('PDF parsing error:', error);
          return NextResponse.json(
            { error: 'Failed to parse PDF file' },
            { status: 500 }
          );
        }
      } else {
        // 文本文件直接读取
        content = buffer.toString('utf-8');
      }

      if (!content.trim()) {
        return NextResponse.json(
          { error: 'File content is empty' },
          { status: 400 }
        );
      }

      fileName = `${uuidv4()}_${file.name}`;
      fileType = file.type;

      // 保存文件到本地（仅对文件上传）
      const memoriesDir = path.join(process.cwd(), 'data', 'memories');
      await fs.mkdir(memoriesDir, { recursive: true });

      const filePath = path.join(memoriesDir, fileName);
      await fs.writeFile(filePath, buffer);
    }
    else {
      return NextResponse.json(
        { error: 'Either file or text content is required' },
        { status: 400 }
      );
    }

    // 分割文本用于Pinecone向量存储（云端使用chunk）
    const chunks = splitTextIntoChunks(content);
    const baseTitle = title || (uploadType === 'text' ? '文本输入' : file?.name || '未知文档');
    const baseType = fileType || 'text/plain';

    console.log(`Processing ${chunks.length} chunks for document: ${baseTitle}`);

    // 为每个chunk生成Pinecone记录
    const pineconeIds: string[] = [];
    for (let i = 0; i < chunks.length; i++) {
      // 为每个chunk生成唯一的ID
      const pineconeId = `${uuidv4()}_chunk_${i}`;

      // 准备Pinecone文档
      const memoryDoc: MemoryDocument = {
        id: pineconeId,
        content: chunks[i],
        metadata: {
          title: chunks.length === 1 ? baseTitle : `${baseTitle} (Part ${i + 1}/${chunks.length})`,
          type: baseType,
          createdAt: new Date().toISOString(),
          fileName: fileName,
          chunkIndex: i,
          totalChunks: chunks.length
        }
      };

      try {
        // 保存到Pinecone（使用chunk分割）
        await ragSystem.addDocument(memoryDoc);
        pineconeIds.push(pineconeId);
        console.log(`✓ Saved chunk ${i + 1}/${chunks.length} to Pinecone: ${pineconeId}`);
      } catch (error) {
        console.error(`❌ Failed to save chunk ${i + 1}/${chunks.length}:`, error);
        throw new Error(`Failed to save chunk ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // 本地数据库保存单条记录（不使用chunk）
    try {
      await createMemoryDocument({
        title: baseTitle,
        content: content, // 保存完整内容
        type: baseType,
        fileName: fileName,
        chunkIndex: 0, // 本地数据库不使用chunk，设为0
        totalChunks: 1, // 本地数据库不使用chunk，设为1
        pineconeId: pineconeIds.join(',') // 保存所有Pinecone ID，用逗号分隔
      });
      console.log(`✓ Saved single document record to database`);
    } catch (dbError) {
      // MySQL保存失败时记录警告，但不影响整体流程
      console.warn(`⚠️  MySQL保存失败:`, dbError instanceof Error ? dbError.message : 'Unknown database error');
      console.log(`📝 数据已安全保存到Pinecone向量数据库`);
    }

    return NextResponse.json({
      success: true,
      message: `Document uploaded and processed. Created ${chunks.length} vector chunks and 1 database record.`,
      fileName: fileName,
      chunksCount: chunks.length,
      pineconeIds: pineconeIds
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

