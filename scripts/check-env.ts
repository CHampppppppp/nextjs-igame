import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

console.log('🔍 检查环境变量配置...');
console.log('');

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ 已配置' : '❌ 未配置');
console.log('OPENAI_API_BASE_URL:', process.env.OPENAI_API_BASE_URL || '使用默认值');
console.log('DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY ? '✅ 已配置' : '❌ 未配置');

console.log('');
console.log('📄 .env.local 文件内容:');
console.log('---');

// 读取并显示.env.local文件内容
import { readFileSync } from 'fs';
try {
  const envContent = readFileSync('.env.local', 'utf-8');
  console.log(envContent);
} catch (error) {
  console.log('❌ 无法读取 .env.local 文件');
}

console.log('---');
