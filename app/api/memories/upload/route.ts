import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ragSystem, MemoryDocument } from '@/lib/ai/rag-chain';
import { splitTextIntoChunks } from '@/lib/ai/embeddings';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    // 检查文件类型
    const allowedTypes = ['text/plain', 'application/pdf', 'text/markdown'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only .txt, .pdf, and .md files are allowed' },
        { status: 400 }
      );
    }

    // 读取文件内容
    const buffer = Buffer.from(await file.arrayBuffer());
    let content = '';

    if (file.type === 'application/pdf') {
      // PDF文件处理（需要pdf-parse包）
      try {
        const pdfParse = (await import('pdf-parse')).default;
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

    // 保存文件到本地
    const memoriesDir = path.join(process.cwd(), 'data', 'memories');
    await fs.mkdir(memoriesDir, { recursive: true });

    const fileName = `${uuidv4()}_${file.name}`;
    const filePath = path.join(memoriesDir, fileName);
    await fs.writeFile(filePath, buffer);

    // 分割文本并添加到RAG系统
    const chunks = splitTextIntoChunks(content);

    for (let i = 0; i < chunks.length; i++) {
      const documentId = `${uuidv4()}_chunk_${i}`;
      const memoryDoc: MemoryDocument = {
        id: documentId,
        content: chunks[i],
        metadata: {
          title: title || file.name,
          type: file.type,
          createdAt: new Date().toISOString(),
          fileName: fileName,
          chunkIndex: i,
          totalChunks: chunks.length
        }
      };

      await ragSystem.addDocument(memoryDoc);
    }

    return NextResponse.json({
      success: true,
      message: `File uploaded and processed. Created ${chunks.length} document chunks.`,
      fileName: fileName,
      chunksCount: chunks.length
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
