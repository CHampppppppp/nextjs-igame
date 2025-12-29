// 测试应用环境中的API连接
import * as dotenv from 'dotenv';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

// 加载环境变量
dotenv.config({ path: '.env.local' });

async function testAPIConnection() {
  console.log('🔍 测试应用环境中的API连接...\n');

  const apiKey = process.env.OPENAI_API_KEY;
  const apiBaseUrl = process.env.OPENAI_API_BASE_URL;

  console.log('API Key:', apiKey ? '已配置' : '未配置');
  console.log('API Base URL:', apiBaseUrl);
  console.log('');

  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY 未配置');
    return;
  }

  try {
    // 直接使用fetch测试API连接
    console.log('⏳ 正在测试API连接...');

    const response = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: '请回复"测试成功"'
          }
        ],
        temperature: 0.1,
        max_tokens: 50
      })
    });

    console.log('API响应状态:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API调用成功!');
      console.log('响应内容:', data.choices[0]?.message?.content);
    } else {
      const errorText = await response.text();
      console.log('❌ API调用失败:', response.status, errorText);
    }
  } catch (error) {
    console.error('❌ 网络错误:', error.message);
  }
}

testAPIConnection();
