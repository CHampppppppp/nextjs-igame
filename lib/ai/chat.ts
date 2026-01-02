/**
 * AI聊天服务模块
 * 负责处理用户消息、意图识别、RAG检索和AI回复生成
 *
 * 主要功能：
 * - 多意图消息处理（时间查询、实验室问题、一般对话）
 * - 集成RAG系统进行知识检索
 * - 会话管理和消息历史
 * - OpenAI API调用和响应处理
 */

import { ragSystem } from './rag-chain';
import { getToolByName } from './tools';

/**
 * 聊天消息接口
 */
export interface ChatMessage {
  /** 消息唯一ID */
  id: string;
  /** 消息角色：用户或助手 */
  role: 'user' | 'assistant';
  /** 消息内容 */
  content: string;
  /** 消息时间戳 */
  timestamp: Date;
}

/**
 * 聊天会话接口
 * 表示一次完整的对话会话
 */
export interface ChatSession {
  /** 会话唯一ID */
  id: string;
  /** 会话中的所有消息 */
  messages: ChatMessage[];
  /** 会话创建时间 */
  createdAt: Date;
  /** 会话最后更新时间 */
  updatedAt: Date;
}

/**
 * AI聊天服务类
 * 处理用户消息的智能回复和会话管理
 */
export class ChatService {
  /** 存储所有活跃的聊天会话 */
  private sessions: Map<string, ChatSession> = new Map();

  /**
   * 处理用户消息并生成AI回复
   *
   * @param message 用户输入的消息
   * @param sessionId 可选的会话ID，如果不提供则创建新会话
   * @returns AI生成的回复内容
   */
  async processMessage(message: string, sessionId?: string): Promise<string> {
    // 获取或创建会话
    const session = this.getOrCreateSession(sessionId);

    // 添加用户消息到会话
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    session.messages.push(userMessage);
    session.updatedAt = new Date();

    // 支持第三方API平台配置
    const apiBaseUrl = process.env.OPENAI_API_BASE_URL;
    const apiKey = process.env.OPENAI_API_KEY;

    let finalResponse = '';

    try {

      // 使用意图判断来决定处理方式
      try {
          const intentResult = await getToolByName('detect_intent')?.function({ message }) || { success: false, intent: 'general' };

          if (intentResult.success && intentResult.intent === 'time_query') {
            // 普通时间查询：只返回当前时间
            try {
              const timeResult = await getToolByName('get_current_time')?.function({}) || { success: false, error: '工具不可用' };

              if (timeResult.success) {
                // 使用系统时间作为上下文，让AI生成自然回答
                const timeContext = `当前准确时间是：${timeResult.datetime}（${timeResult.timezone}时区）`;
                const timePrompt = `${timeContext}

用户的问题是：${message}

请基于上述准确时间信息，用自然语言回答用户的问题。`;

                const response = await this.callOpenAIAPI(timePrompt);
                finalResponse = response.text;
              } else {
                finalResponse = `获取时间失败: ${timeResult.error}`;
              }
            } catch (timeError) {
              console.warn('Time tool failed, using fallback:', timeError);
              finalResponse = this.getTimeFallbackResponse();
            }
          } else if (intentResult.success && intentResult.intent === 'historical_time_query') {
            // 历史时间查询：结合记忆检索
            try {
              const timeResult = await getToolByName('get_current_time')?.function({}) || { success: false, error: '工具不可用' };
              const timeContext = timeResult.success ? `当前准确时间是：${timeResult.datetime}（${timeResult.timezone}时区）` : '';

              // 检索相关记忆
              const relevantDocs = await ragSystem.searchRelevantDocuments(message, 5);
              const context = this.buildContext(relevantDocs);

              const historicalPrompt = `${timeContext ? timeContext + '\n\n' : ''}用户的问题涉及历史事件或过去的时间。请基于以下相关记忆信息来回答：

${context ? `相关记忆信息：\n${context}\n\n` : '没有找到相关记忆信息。\n\n'}

用户的问题：${message}

请基于上述信息回答用户的问题。如果记忆信息中没有相关内容，请说明没有找到相关信息。`;

              const response = await this.callOpenAIAPI(historicalPrompt);
              finalResponse = response.text;
            } catch (historicalError) {
              console.warn('Historical time query failed, using fallback:', historicalError);
              finalResponse = this.getTimeFallbackResponse();
            }
          } else if (intentResult.success && intentResult.intent === 'lab_related') {
            // 实验室相关问题：使用 RAG 检索
            try {
              const relevantDocs = await ragSystem.searchRelevantDocuments(message, 5);
              const context = this.buildContext(relevantDocs);

              const systemPrompt = `你是iGame Lab（智能可视化与仿真实验室）的AI助手。你是实验室的官方代表，负责回答关于实验室的所有问题。

实验室简介：
- 实验室全称：智能可视建模与仿真实验室 (Intelligent Visual Modeling & Simulation Lab, iGame)
- 所属单位：杭州电子科技大学计算机学院图形图像所
- 负责人：徐岗教授
- 团队规模：6名教师（1名教授，3名副教授，2名讲师），40多名研究生，3名博士研究生

主要研究方向：
- 计算机辅助设计与仿真
- 等几何分析
- 计算机视觉
- 机器学习

${context ? `相关信息：\n${context}\n\n` : ''}

请基于以上信息回答用户的问题。如果你不知道确切信息，请诚实地说明。保持友好、专业和有帮助的态度。`;

              const ragPrompt = `基于实验室信息回答用户的问题：${message}`;

            const response = await this.callOpenAIAPI(systemPrompt + '\n\n' + ragPrompt);

              finalResponse = response.text || '抱歉，我无法找到相关信息。';
            } catch (ragError) {
              console.warn('RAG processing failed, using fallback response:', ragError);
              finalResponse = this.getLabFallbackResponse(message);
            }
          } else {
            // 通用问题：直接使用大模型回复
            try {
              const generalPrompt = `请回答用户的问题。你是iGame Lab的AI助手，但这个问题似乎不是关于实验室的具体信息，请直接回答。

用户问题：${message}`;

            const response = await this.callOpenAIAPI('你是一个友好的AI助手，可以回答各种问题。请保持专业、准确和有帮助的态度。\n\n' + generalPrompt);

              finalResponse = response.text || '抱歉，我无法生成回复。';
            } catch (generalError) {
              console.warn('General response failed, using fallback:', generalError);
              finalResponse = this.getGeneralFallbackResponse(message);
            }
          }
        } catch (error) {
          console.warn('Intent detection failed, using fallback responses:', error);

          // 如果意图判断失败，使用预设的回答逻辑
          if (this.isTimeQueryFallback(message)) {
            finalResponse = this.getTimeFallbackResponse();
          } else if (this.isLabRelatedFallback(message)) {
            // 实验室相关问题但API不可用时的预设回答
            finalResponse = this.getLabFallbackResponse(message);
          } else {
            // 通用问题但API不可用时的预设回答
            finalResponse = this.getGeneralFallbackResponse(message);
          }
        }
      } catch (error) {
        console.error('Error processing chat message:', error);

        // 当所有API都不可用时，使用离线回答
        if (this.isTimeQueryFallback(message)) {
          finalResponse = this.getTimeFallbackResponse();
        } else if (this.isLabRelatedFallback(message)) {
          // 实验室相关问题但API不可用时的预设回答
          finalResponse = this.getLabFallbackResponse(message);
        } else {
          // 通用问题但API不可用时的预设回答
          finalResponse = this.getGeneralFallbackResponse(message);
        }
      }

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: finalResponse,
        timestamp: new Date()
      };

      session.messages.push(assistantMessage);

      return finalResponse;
  }

  // 后备意图判断方法（离线版本）
  // 注意：由于我们现在完全依赖AI进行意图判断，这里返回false让系统使用通用处理
  private isTimeQueryFallback(message: string): boolean {
    return false; // 不使用关键词匹配，完全依赖AI判断
  }


  private isLabRelatedFallback(message: string): boolean {
    return false; // 不使用关键词匹配，完全依赖AI判断
  }

  // 时间查询的离线回答
  private getTimeFallbackResponse(): string {
    try {
      const now = new Date();
      const localDateStr = now.toLocaleDateString('zh-CN');
      const localTimeStr = now.toLocaleTimeString('zh-CN');
      return `当前时间 (${'本地时区'}): ${localDateStr} ${localTimeStr}`;
    } catch (error) {
      return '抱歉，当前无法获取时间信息。';
    }
  }

  // 实验室相关问题的离线回答
  private getLabFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    // 实验室基本信息
    if (lowerMessage.includes('多少人') || lowerMessage.includes('规模') || lowerMessage.includes('成员')) {
      return 'iGame实验室共有6名教师（1名教授，3名副教授，2名讲师），40多名研究生，3名博士研究生。';
    }

    // 负责人信息
    if (lowerMessage.includes('负责人') || lowerMessage.includes('徐岗') || lowerMessage.includes('教授')) {
      return 'iGame实验室负责人是徐岗教授。';
    }

    // 研究方向
    if (lowerMessage.includes('研究') || lowerMessage.includes('方向')) {
      return 'iGame实验室主要研究方向包括：计算机辅助设计与仿真、等几何分析、计算机视觉、机器学习。';
    }

    // 学校信息
    if (lowerMessage.includes('学校') || lowerMessage.includes('大学') || lowerMessage.includes('杭州电子科技大学')) {
      return 'iGame实验室属于杭州电子科技大学计算机学院图形图像所。';
    }

    // 默认实验室回答
    return 'iGame实验室（智能可视化与仿真实验室）专注于计算机辅助设计与仿真、等几何分析、计算机视觉和机器学习等领域的研究。如需了解具体项目或最新动态，请访问实验室官网。';
  }

  // 通用问题的离线回答
  private getGeneralFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    // 简单问候
    if (lowerMessage.includes('你好') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return '您好！我是iGame实验室的AI助手，很高兴为您服务！';
    }

    // 感谢
    if (lowerMessage.includes('谢谢') || lowerMessage.includes('thank')) {
      return '不用谢！如果您还有其他问题，我很乐意为您解答。';
    }

    // 关于AI的问题
    if (lowerMessage.includes('你是谁') || lowerMessage.includes('what are you')) {
      return '我是iGame实验室的AI助手，可以回答关于实验室的问题，也可以帮助解答一般的疑问。';
    }

    // 数学问题
    if (lowerMessage.includes('1+1') || lowerMessage.includes('等于几')) {
      return '1+1当然等于2啦！还有什么数学问题吗？';
    }

    // 天气问题
    if (lowerMessage.includes('天气')) {
      return '抱歉，我无法实时获取天气信息。您可以查看天气APP或网站获取准确的天气预报。';
    }

    // 默认通用回答
    return '我目前处于离线模式，无法连接到AI服务。不过我可以为您提供一些关于iGame实验室的基本信息，或者解答简单的通用问题。如果您的问题比较复杂，请稍后重试。';
  }

  // 直接调用OpenAI API
  private async callOpenAIAPI(prompt: string): Promise<{ text: string }> {
    const apiBaseUrl = process.env.OPENAI_API_BASE_URL;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const url = `${apiBaseUrl}/chat/completions`;

    const response = await fetch(url, {
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
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0]?.message?.content || '抱歉，我无法生成回复。'
    };
  }

  private buildContext(documents: any[]): string {
    if (!documents || documents.length === 0) return '';

    return documents
      .map(doc => `[${doc.metadata?.title || '相关信息'}]: ${doc.content}`)
      .join('\n\n');
  }

  private getOrCreateSession(sessionId?: string): ChatSession {
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.sessions.set(sessionId, session);
    }

    return session;
  }

  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): ChatSession[] {
    return Array.from(this.sessions.values());
  }

  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}

export const chatService = new ChatService();
