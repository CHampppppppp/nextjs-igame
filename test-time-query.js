// 测试时间查询功能
import * as dotenv from 'dotenv';
import { ChatService } from './lib/ai/chat.js';

// 加载环境变量
dotenv.config({ path: '.env.local' });

async function testTimeQuery() {
  console.log('🕐 测试时间查询功能...\n');

  const chatService = new ChatService();

  // 测试时间查询
  const testMessages = [
    '现在是什么时间？',
    '今天是什么时候？',
    '几点了？',
    '现在几点？',
    '当前时间是什么？'
  ];

  for (const message of testMessages) {
    try {
      console.log(`测试问题: "${message}"`);
      const response = await chatService.processMessage(message);
      console.log(`AI回答: ${response}`);
      console.log('---');
    } catch (error) {
      console.error(`测试失败: ${error.message}`);
    }
  }
}

testTimeQuery();
