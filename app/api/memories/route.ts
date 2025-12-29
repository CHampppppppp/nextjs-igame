import { NextRequest, NextResponse } from 'next/server';
import { ragSystem } from '@/lib/ai/rag-chain';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const documents = await ragSystem.getAllDocuments();
    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Get memories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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

    await ragSystem.deleteDocument(documentId);

    // 同时删除本地文件
    const memoriesDir = path.join(process.cwd(), 'data', 'memories');
    const files = await fs.readdir(memoriesDir);
    const fileToDelete = files.find(file => file.startsWith(documentId));

    if (fileToDelete) {
      await fs.unlink(path.join(memoriesDir, fileToDelete));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete memory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
