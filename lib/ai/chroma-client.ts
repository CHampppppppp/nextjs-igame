import { ChromaClient } from 'chromadb';

let chromaClient: ChromaClient | null = null;

export function getChromaClient(): ChromaClient {
  if (!chromaClient) {
    // 使用内存模式，适合开发环境
    chromaClient = new ChromaClient({
      path: "http://localhost:8000" // 默认ChromaDB服务器地址
    });
  }
  return chromaClient;
}

export async function ensureCollection(collectionName: string) {
  const client = getChromaClient();
  try {
    return await client.getOrCreateCollection({
      name: collectionName,
      metadata: { "description": "iGame Lab memory collection" }
    });
  } catch (error) {
    console.error('Error creating collection:', error);
    throw error;
  }
}
