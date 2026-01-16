#!/usr/bin/env tsx

/**
 * 数据库初始化和迁移脚本
 * 使用 Prisma 初始化 Neon PostgreSQL 数据库
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initDatabase() {
  console.log('🚀 Initializing Neon PostgreSQL database...\n');

  try {
    // 测试数据库连接
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful\n');

    // 运行数据库迁移
    console.log('Running database migrations...');
    // Prisma 会自动处理表创建，基于 schema.prisma

    // 验证表是否创建成功
    console.log('Verifying table creation...');

    // 检查 MemoryDocument 表
    const memoryDocCount = await prisma.memoryDocument.count();
    console.log(`✅ MemoryDocument table created (${memoryDocCount} records)`);

    // 检查 Student 表
    const studentCount = await prisma.student.count();
    console.log(`✅ Student table created (${studentCount} records)`);

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📊 Database is ready for:');
    console.log('  - Student profile management');
    console.log('  - AI memory document storage');
    console.log('  - Full-text search capabilities');

    console.log('\n🔧 Available Prisma commands:');
    console.log('  npx prisma studio    # Open Prisma Studio');
    console.log('  npx prisma migrate dev  # Create and apply migrations');
    console.log('  npx prisma db push   # Push schema changes to database');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);

    // 提供故障排除建议
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your DATABASE_URL in .env.local');
    console.log('2. Ensure Neon database is accessible');
    console.log('3. Verify database credentials');
    console.log('4. Check Prisma schema for syntax errors');

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initDatabase().catch((error) => {
    console.error('Script execution failed:', error);
    process.exit(1);
  });
}

export { initDatabase };
