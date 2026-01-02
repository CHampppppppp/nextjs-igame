import { query, testConnection, closePool } from '../lib/db/mysql';

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS memory_documents (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content LONGTEXT NOT NULL,
  type VARCHAR(100) NOT NULL,
  file_name VARCHAR(500),
  chunk_index INT DEFAULT 0,
  total_chunks INT DEFAULT 1,
  pinecone_id VARCHAR(200) NOT NULL,
  status ENUM('active', 'deleted') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_status (status),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at),
  INDEX idx_pinecone_id (pinecone_id),
  INDEX idx_file_name (file_name),

  FULLTEXT INDEX ft_title_content (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const CREATE_STATS_VIEW_SQL = `
CREATE OR REPLACE VIEW memory_stats AS
SELECT
  COUNT(*) as total_documents,
  SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_documents,
  SUM(CASE WHEN status = 'deleted' THEN 1 ELSE 0 END) as deleted_documents,
  COUNT(DISTINCT type) as unique_types
FROM memory_documents;
`;

async function initDatabase() {
  console.log('🚀 Initializing database...\n');

  try {
    // 测试连接
    console.log('Testing database connection...');
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // 创建表
    console.log('Creating memory_documents table...');
    await query(CREATE_TABLE_SQL);
    console.log('✅ Table created successfully');

    // 创建统计视图
    console.log('Creating memory_stats view...');
    await query(CREATE_STATS_VIEW_SQL);
    console.log('✅ View created successfully');

    // 验证表结构
    console.log('Verifying table structure...');
    const [tables] = await query('SHOW TABLES LIKE "memory_documents"');
    if (tables.length === 0) {
      throw new Error('Table creation failed');
    }

    // 显示表结构
    const [columns] = await query('DESCRIBE memory_documents');
    console.log('Table structure:');
    columns.forEach((col: any) => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''}`);
    });

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📊 You can now:');
    console.log('  - Upload memory documents via the admin interface');
    console.log('  - View memory statistics');
    console.log('  - Search and manage memory documents');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await closePool();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initDatabase();
}

export { initDatabase };
