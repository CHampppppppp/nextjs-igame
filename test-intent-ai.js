// 测试AI意图判断功能
import * as dotenv from 'dotenv';
import { getToolByName } from './lib/ai/tools.js';

// 加载环境变量
dotenv.config({ path: '.env.local' });

async function testIntentDetection() {
  console.log('🧠 测试AI意图判断功能...\n');

  // 测试用例
  const testCases = [
    {
      message: '现在是什么时候？',
      expected: 'time_query',
      description: '时间查询'
    },
    {
      message: '今天是几号？',
      expected: 'time_query',
      description: '日期查询'
    },
    {
      message: '徐岗教授是做什么的？',
      expected: 'lab_related',
      description: '实验室人员查询'
    },
    {
      message: '实验室有多少人？',
      expected: 'lab_related',
      description: '实验室信息查询'
    },
    {
      message: '1+1等于几？',
      expected: 'general',
      description: '通用数学问题'
    },
    {
      message: '今天天气怎么样？',
      expected: 'general',
      description: '天气查询'
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`测试: ${testCase.description}`);
      console.log(`问题: "${testCase.message}"`);

      const result = await getToolByName('detect_intent')?.function({ message: testCase.message });

      console.log(`结果: ${JSON.stringify(result, null, 2)}`);
      console.log(`期望: ${testCase.expected}`);
      console.log(`匹配: ${result?.intent === testCase.expected ? '✅' : '❌'}\n`);
    } catch (error) {
      console.error(`测试失败: ${error.message}\n`);
    }
  }

  console.log('AI意图判断测试完成！');
}

testIntentDetection();
