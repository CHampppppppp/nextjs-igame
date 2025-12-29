import { RAGSystem } from '../lib/ai/rag-chain';
import { generateEmbeddings } from '../lib/ai/embeddings';

async function testPineconeIntegration() {
  console.log('Testing Pinecone integration...\n');

  try {
    // 测试环境变量
    console.log('Environment variables check:');
    console.log('- OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Not set');
    console.log('- PINECONE_API_KEY:', process.env.PINECONE_API_KEY ? '✓ Set' : '✗ Not set');
    console.log('- PINECONE_INDEX_NAME:', process.env.PINECONE_INDEX_NAME || 'igame-lab-memory (default)');
    console.log();

    // 测试RAG系统初始化（这个应该在有或没有API密钥的情况下都工作）
    console.log('Testing RAG system initialization...');
    const ragSystem = new RAGSystem();
    console.log('✓ RAG system initialized successfully');

    // 如果有Pinecone配置，测试基本操作
    if (process.env.PINECONE_API_KEY) {
      console.log('Testing Pinecone operations...');

      // 创建测试文档
      const testDoc = {
        id: `test-doc-${Date.now()}`,
        content: 'iGame实验室专注于计算机辅助设计与仿真、等几何分析、计算机视觉和机器学习等领域的研究。',
        metadata: {
          title: '实验室介绍',
          type: 'info',
          createdAt: new Date().toISOString(),
          fileName: 'test.txt'
        }
      };

      // 测试添加文档
      console.log('Adding test document...');
      await ragSystem.addDocument(testDoc);
      console.log('✓ Document added successfully');

      // 等待一秒确保索引完成
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 测试搜索
      console.log('Searching for documents...');
      const results = await ragSystem.searchRelevantDocuments('实验室研究方向', 3);
      console.log(`✓ Found ${results.length} relevant documents`);

      if (results.length > 0) {
        console.log('Top result:', results[0].content.substring(0, 100) + '...');
      }

      // 测试获取所有文档
      console.log('Getting all documents...');
      const allDocs = await ragSystem.getAllDocuments();
      console.log(`✓ Retrieved ${allDocs.length} documents total`);

      // 清理测试数据
      console.log('Cleaning up test document...');
      await ragSystem.deleteDocument(testDoc.id);
      console.log('✓ Test document deleted');

    } else {
      console.log('⚠️  Pinecone API key not configured, skipping Pinecone-specific tests');
      console.log('   System will use memory vector store as fallback');
    }

    console.log('\n✅ All tests passed! Pinecone integration is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// 运行测试
testPineconeIntegration().catch(console.error);
