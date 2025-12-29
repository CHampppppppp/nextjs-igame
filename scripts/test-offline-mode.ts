// 测试离线模式功能的脚本
import { ChatService } from '../lib/ai/chat';

async function testOfflineMode() {
  console.log('开始测试离线模式功能...\n');

  const chatService = new ChatService();

  // 测试用例
  const testCases = [
    {
      message: '你们实验室有多少人？',
      type: '实验室相关',
      description: '实验室成员信息查询'
    },
    {
      message: '徐岗教授是做什么的？',
      type: '实验室相关',
      description: '实验室负责人查询'
    },
    {
      message: '实验室主要研究什么？',
      type: '实验室相关',
      description: '研究方向查询'
    },
    {
      message: '现在几点了？',
      type: '时间查询',
      description: '时间查询'
    },
    {
      message: '你好，请问1+1等于几？',
      type: '通用问题',
      description: '简单数学问题'
    },
    {
      message: '今天天气怎么样？',
      type: '通用问题',
      description: '天气查询'
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`测试: ${testCase.description}`);
      console.log(`类型: ${testCase.type}`);
      console.log(`问题: "${testCase.message}"`);

      // 由于API不可用，这会触发离线模式
      const response = await chatService.processMessage(testCase.message);

      console.log(`回答: ${response}`);
      console.log(`---\n`);
    } catch (error) {
      console.error(`测试失败: ${error}\n`);
    }
  }

  console.log('离线模式测试完成！');
}

// 运行测试
testOfflineMode().catch(console.error);
