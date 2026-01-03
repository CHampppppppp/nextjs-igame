import { query, testConnection, closePool } from '../lib/db/mysql';

const CREATE_MEMORY_TABLE_SQL = `
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

const CREATE_STUDENT_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(100) PRIMARY KEY,
  chinese_name VARCHAR(100) NOT NULL,
  english_name VARCHAR(200),
  grade VARCHAR(50) NOT NULL,
  degree VARCHAR(50) NOT NULL,
  research VARCHAR(500),
  bio LONGTEXT,
  email VARCHAR(200),
  phone VARCHAR(20),
  avatar VARCHAR(500),
  github VARCHAR(500),
  linkedin VARCHAR(500),
  website VARCHAR(500),
  skills LONGTEXT,
  interests LONGTEXT,
  publications LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_grade (grade),
  INDEX idx_degree (degree),
  INDEX idx_chinese_name (chinese_name),
  INDEX idx_english_name (english_name),

  FULLTEXT INDEX ft_bio_skills (bio, skills, interests)
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

    // 创建memory_documents表
    console.log('Creating memory_documents table...');
    await query(CREATE_MEMORY_TABLE_SQL);
    console.log('✅ Memory documents table created successfully');

    // 创建students表
    console.log('Creating students table...');
    await query(CREATE_STUDENT_TABLE_SQL);
    console.log('✅ Students table created successfully');

    // 创建统计视图
    console.log('Creating memory_stats view...');
    await query(CREATE_STATS_VIEW_SQL);
    console.log('✅ View created successfully');

    // 验证表结构
    console.log('Verifying table structures...');
    const [memoryTables] = await query('SHOW TABLES LIKE "memory_documents"');
    const [studentTables] = await query('SHOW TABLES LIKE "students"');

    if (memoryTables.length === 0 || studentTables.length === 0) {
      throw new Error('Table creation failed');
    }

    console.log('✅ All tables created successfully');

    // 显示students表结构
    const [studentColumns] = await query('DESCRIBE students');
    console.log('\nStudents table structure:');
    studentColumns.forEach((col: any) => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''}`);
    });

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📊 You can now:');
    console.log('  - Upload memory documents via the admin interface');
    console.log('  - View memory statistics');
    console.log('  - Search and manage memory documents');
    console.log('  - Create and manage student profiles');
    console.log('  - View student details and information');

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
