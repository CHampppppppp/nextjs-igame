// 测试意图判断功能的脚本
import { getToolByName } from '../lib/ai/tools.js';

async function testIntentDetection() {
  console.log('开始测试意图判断功能...\n');

  // 测试用例
  const testCases = [
    {
      message: '你们实验室有多少人？',
      expected: 'lab_related',
      description: '实验室成员相关问题'
    },
    {
      message: '徐岗教授是做什么的？',
      expected: 'lab_related',
      description: '实验室负责人相关问题'
    },
    {
      message: '实验室主要研究什么方向？',
      expected: 'lab_related',
      description: '研究方向相关问题'
    },
    {
      message: '今天天气怎么样？',
      expected: 'general',
      description: '通用问题'
    },
    {
      message: '1+1等于几？',
      expected: 'general',
      description: '数学问题'
    },
    {
      message: '杭州电子科技大学在哪里？',
      expected: 'lab_related',
      description: '学校相关但与实验室有关'
    },
    {
      message: '计算机视觉有哪些应用？',
      expected: 'general',
      description: '虽然是研究方向但不是具体问实验室'
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
      console.error(`测试失败: ${error}\n`);
    }
  }

  console.log('意图判断测试完成！');
}

// 运行测试
testIntentDetection().catch(console.error);
