import { Pinecone } from '@pinecone-database/pinecone';

async function createPineconeIndex() {
  console.log('Creating Pinecone index for iGame Lab...\n');

  // 检查环境变量
  const apiKey = process.env.PINECONE_API_KEY;
  const indexName = process.env.PINECONE_INDEX_NAME || 'igame-lab-memory';

  if (!apiKey) {
    console.error('❌ Error: PINECONE_API_KEY environment variable is not set');
    console.log('\nPlease set your Pinecone API key:');
    console.log('export PINECONE_API_KEY=your_api_key_here');
    process.exit(1);
  }

  try {
    // 初始化Pinecone客户端
    console.log('Initializing Pinecone client...');
    const pinecone = new Pinecone({
      apiKey: apiKey,
    });

    // 检查索引是否已存在
    console.log(`Checking if index "${indexName}" exists...`);
    const existingIndexes = await pinecone.listIndexes();
    const indexExists = existingIndexes.indexes?.some(index => index.name === indexName);

    if (indexExists) {
      console.log(`✅ Index "${indexName}" already exists!`);

      // 获取索引信息
      const index = pinecone.index(indexName);
      const stats = await index.describeIndexStats();
      console.log(`📊 Index stats:`);
      console.log(`   - Vectors: ${stats.totalRecordCount}`);
      console.log(`   - Dimension: ${stats.dimension || 'unknown'}`);

      return;
    }

    // 创建新索引
    console.log(`Creating index "${indexName}" with 1536 dimensions...`);

    await pinecone.createIndex({
      name: indexName,
      dimension: 1536, // text-embedding-3-small 的维度
      metric: 'cosine', // 余弦相似度
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1' // 你可以根据需要更改区域
        }
      }
    });

    console.log('⏳ Waiting for index to be ready... (this may take a few minutes)');

    // 等待索引创建完成
    let isReady = false;
    let attempts = 0;
    const maxAttempts = 60; // 最多等待5分钟

    while (!isReady && attempts < maxAttempts) {
      try {
        const indexes = await pinecone.listIndexes();
        const index = indexes.indexes?.find(idx => idx.name === indexName);

        if (index && index.status?.ready === true) {
          isReady = true;
          console.log('✅ Index created successfully!');
          console.log(`📍 Index name: ${indexName}`);
          console.log(`🌐 Cloud: ${index.spec?.serverless?.cloud || 'unknown'}`);
          console.log(`📍 Region: ${index.spec?.serverless?.region || 'unknown'}`);
          console.log(`📏 Dimension: 1536`);
          console.log(`📐 Metric: cosine`);
          break;
        }

        console.log(`   Attempt ${attempts + 1}/${maxAttempts}: Index not ready yet, waiting...`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒
        attempts++;
      } catch (error) {
        console.log(`   Attempt ${attempts + 1}/${maxAttempts}: Error checking status, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
      }
    }

    if (!isReady) {
      console.log('⚠️  Index creation initiated but may still be processing...');
      console.log('   You can check the status in your Pinecone dashboard.');
    }

    console.log('\n🎉 Setup complete! You can now use Pinecone in your application.');
    console.log('\nNext steps:');
    console.log('1. Make sure your .env file has the correct PINECONE_API_KEY');
    console.log('2. Run your application - it should now use Pinecone for vector storage');

  } catch (error) {
    console.error('❌ Error creating Pinecone index:', error);

    // 提供更具体的错误信息
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        console.log('\n💡 Tip: Check that your PINECONE_API_KEY is correct');
      } else if (error.message.includes('Forbidden')) {
        console.log('\n💡 Tip: Your API key may not have permission to create indexes');
      } else if (error.message.includes('dimension')) {
        console.log('\n💡 Tip: The dimension 1536 is required for text-embedding-3-small');
      }
    }

    process.exit(1);
  }
}

// 检查命令行参数
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('Pinecone Index Creation Script');
  console.log('');
  console.log('Usage: npx tsx scripts/create-pinecone-index.ts');
  console.log('');
  console.log('Environment Variables:');
  console.log('  PINECONE_API_KEY    - Your Pinecone API key (required)');
  console.log('  PINECONE_INDEX_NAME - Index name (default: igame-lab-memory)');
  console.log('');
  console.log('This script will create a Pinecone index with:');
  console.log('  - 1536 dimensions (for text-embedding-3-small)');
  console.log('  - Cosine similarity metric');
  console.log('  - AWS us-east-1 region');
  process.exit(0);
}

// 运行脚本
createPineconeIndex().catch(console.error);
