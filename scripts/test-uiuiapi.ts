import * as dotenv from 'dotenv';
import { generateEmbeddings } from '../lib/ai/embeddings';

// 手动加载环境变量
dotenv.config({ path: '.env.local' });

async function testUiuiAPI() {
  console.log('测试 uiuiapi 配置...');
  console.log('');

  // 显示当前配置
  console.log('📋 当前配置:');
  console.log(`   API Key: ${process.env.OPENAI_API_KEY ? '已设置' : '未设置'}`);
  console.log(`   Base URL: ${process.env.OPENAI_API_BASE_URL}`);
  console.log('');

  try {
    // 测试向量嵌入API
    console.log('🔄 测试向量嵌入API...');
    const testText = 'Hello, this is a test message for embeddings.';
    const embedding = await generateEmbeddings(testText);
    console.log(`✅ 向量嵌入成功！维度: ${embedding.length}`);

    // 测试聊天API (如果配置了)
    if (process.env.DEEPSEEK_API_KEY) {
      console.log('✅ DeepSeek API key 已配置，可以测试聊天功能');
    } else {
      console.log('⚠️  DeepSeek API key 未配置，聊天功能将不可用');
    }

    console.log('');
    console.log('🎉 uiuiapi 配置测试完成！AI agent 可以正常工作了。');

  } catch (error) {
    console.error('❌ 测试失败:', error);
    console.log('');
    console.log('🔧 故障排除建议:');

    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('UND_ERR_SOCKET')) {
        console.log('1. 🌐 网络连接问题:');
        console.log('   - 检查网络连接是否正常');
        console.log('   - 尝试 ping sg.uiuiapi.com');
        console.log('   - 确认防火墙没有阻止连接');
        console.log('');
      }

      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        console.log('2. 🔑 API密钥问题:');
        console.log('   - 检查 OPENAI_API_KEY 是否正确');
        console.log('   - 确认密钥没有过期');
        console.log('   - 检查账户余额');
        console.log('');
      }

      if (error.message.includes('404') || error.message.includes('not found')) {
        console.log('3. 🔗 API端点问题:');
        console.log('   - 检查 OPENAI_API_BASE_URL 是否正确');
        console.log('   - 尝试 https://api.uiuiapi.com/v1');
        console.log('   - 确认uiuiapi支持该端点');
        console.log('');
      }
    }

    console.log('4. 🆘 获取帮助:');
    console.log('   - 查看 UIUIAPI_CONFIG.md 文档');
    console.log('   - 联系 uiuiapi 客服支持');
    console.log('   - 检查账户状态和使用限制');
  }
}

// 运行测试
testUiuiAPI();
