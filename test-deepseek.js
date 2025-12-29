// 测试 DeepSeek API 连接
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

async function testDeepSeekAPI() {
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
  const deepseekBaseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

  console.log('DeepSeek API Key:', deepseekApiKey ? 'Configured' : 'Not configured');
  console.log('DeepSeek Base URL:', deepseekBaseUrl);

  if (!deepseekApiKey) {
    console.error('DEEPSEEK_API_KEY not configured');
    return;
  }

  try {
    const apiUrl = `${deepseekBaseUrl}/chat/completions`;
    console.log('Calling API:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: 'Hello, test message'
          }
        ],
        temperature: 0.1,
        max_tokens: 10
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
    } else {
      const data = await response.json();
      console.log('API Response:', data);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

testDeepSeekAPI();
