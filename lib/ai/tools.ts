// 工具函数定义
export interface ToolFunction {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
  function: (args: any) => Promise<any>;
}

// 获取当前时间的工具函数
export const getCurrentTime: ToolFunction = {
  name: 'get_current_time',
  description: '获取当前的日期和时间信息',
  parameters: {
    type: 'object',
    properties: {
      timezone: {
        type: 'string',
        description: '时区，例如 "Asia/Shanghai"，默认为本地时区'
      },
      format: {
        type: 'string',
        description: '时间格式，"full" 包含日期和时间，"date" 仅日期，"time" 仅时间',
        enum: ['full', 'date', 'time'],
        default: 'full'
      }
    },
    required: []
  },
  function: async (args: { timezone?: string; format?: string }) => {
    try {
      const now = new Date();

      // 处理时区
      let date = now;
      if (args.timezone) {
        // 使用 Intl.DateTimeFormat 来处理时区
        const options: Intl.DateTimeFormatOptions = {
          timeZone: args.timezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        };

        const formatter = new Intl.DateTimeFormat('zh-CN', options);
        const parts = formatter.formatToParts(now);

        // 从格式化结果中提取信息
        const dateParts: Record<string, string> = {};
        parts.forEach(part => {
          dateParts[part.type] = part.value;
        });

        const dateStr = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
        const timeStr = `${dateParts.hour}:${dateParts.minute}:${dateParts.second}`;

        switch (args.format) {
          case 'date':
            return {
              success: true,
              timezone: args.timezone,
              date: dateStr
            };
          case 'time':
            return {
              success: true,
              timezone: args.timezone,
              time: timeStr
            };
          default:
            return {
              success: true,
              timezone: args.timezone,
              datetime: `${dateStr} ${timeStr}`
            };
        }
      }

      // 本地时区
      const localDateStr = now.toLocaleDateString('zh-CN');
      const localTimeStr = now.toLocaleTimeString('zh-CN');

      switch (args.format) {
        case 'date':
          return {
            success: true,
            timezone: 'local',
            date: localDateStr
          };
        case 'time':
          return {
            success: true,
            timezone: 'local',
            time: localTimeStr
          };
        default:
          return {
            success: true,
            timezone: 'local',
            datetime: `${localDateStr} ${localTimeStr}`
          };
      }
    } catch (error) {
      return {
        success: false,
        error: `获取时间失败: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }
};

// 意图判断工具函数
export const detectIntent: ToolFunction = {
  name: 'detect_intent',
  description: '判断用户问题的意图是否与iGame实验室相关',
  parameters: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: '用户输入的消息'
      }
    },
    required: ['message']
  },
  function: async (args: { message: string }) => {
    try {
      // 使用 DeepSeek 来判断意图
      const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
      const deepseekBaseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';

      if (!deepseekApiKey || deepseekApiKey === 'your_deepseek_api_key_here') {
        // 如果没有配置 DeepSeek API，使用简单的关键词匹配作为降级方案
        console.warn('DeepSeek API key not configured or invalid, using fallback intent detection');
        return fallbackIntentDetection(args.message);
      }

      const apiUrl = `${deepseekBaseUrl}/chat/completions`;

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
              role: 'system',
              content: `你是一个意图判断助手。请分析用户的问题，判断其意图类型。

意图类型：
1. "lab_related" - 与iGame实验室相关的问题（成员、研究方向、项目、论文、活动、历史事件等）
2. "time_query" - 询问当前时间、日期的问题
3. "historical_time_query" - 询问过去的历史事件或时间相关问题（如"去年圣诞节发生了什么"）
4. "general" - 其他一般性问题

iGame实验室是智能可视化与仿真实验室，属于杭州电子科技大学计算机学院。主要研究方向包括：计算机辅助设计与仿真、等几何分析、计算机视觉、机器学习。

实验室成员包括：徐岗教授（负责人）、高飞、顾仁树、邬海燕、徐金兰、许佳敏、肖州方、徐钢等老师。

时间查询示例：
- 现在几点了？
- 今天是什么时候？
- 当前时间是什么？
- 现在是什么日期？

历史时间查询示例：
- 去年圣诞节发生了什么？
- 上次活动是什么时候？
- 以前有什么新闻？
- 过去发生了什么事情？
- 许佳敏老师去年做了什么？

实验室相关问题示例：
- 实验室有多少人？
- 徐岗教授的研究方向是什么？
- 许佳敏老师最近在做什么？
- 实验室的最新活动是什么？

请根据用户问题判断意图类型，只返回JSON格式：
{"intent": "lab_related"} 或 {"intent": "time_query"} 或 {"intent": "historical_time_query"} 或 {"intent": "general"}`
            },
            {
              role: 'user',
              content: args.message
            }
          ],
          temperature: 0.1,
          max_tokens: 100
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`DeepSeek API error: ${response.status}, ${response.statusText}, Response: ${errorText}`);
        throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const result = data.choices[0]?.message?.content;

      if (!result) {
        throw new Error('No response from DeepSeek');
      }

      // 解析 JSON 响应
      try {
        const parsed = JSON.parse(result.trim());
        return {
          success: true,
          intent: parsed.intent || 'general',
          confidence: parsed.confidence || 0.8
        };
      } catch (parseError) {
        // 如果解析失败，返回保守的默认意图
        console.warn('Failed to parse DeepSeek response, returning default intent:', parseError);
        return {
          success: false,
          intent: 'general',
          confidence: 0.5,
          error: 'Failed to parse AI response'
        };
      }
    } catch (error) {
      console.warn('DeepSeek intent detection failed, returning default intent:', error);
      return {
        success: false,
        intent: 'general',
        confidence: 0.5,
        error: 'AI model request failed'
      };
    }
  }
};


// 可用的工具函数列表
export const availableTools: ToolFunction[] = [
  getCurrentTime,
  detectIntent
];

// 根据函数名查找工具函数
export function getToolByName(name: string): ToolFunction | undefined {
  return availableTools.find(tool => tool.name === name);
}

// 为 OpenAI API 格式化工具定义
export function formatToolsForOpenAI(): any[] {
  return availableTools.map(tool => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }
  }));
}

// 降级意图检测函数（当DeepSeek API不可用时使用）
function fallbackIntentDetection(message: string): { success: boolean; intent: string; confidence: number; error?: string } {
  const lowerMessage = message.toLowerCase();

  // 时间查询关键词
  const timeKeywords = ['几点', '时间', '现在', '今天', '昨天', '明天', '什么时候', 'what time', 'current time'];
  const hasTimeKeyword = timeKeywords.some(keyword => lowerMessage.includes(keyword));

  // 历史时间查询关键词
  const historicalTimeKeywords = ['去年', '前年', '上个月', '去年', '以前', '当时', '过去', 'last year', 'ago', 'previously'];
  const hasHistoricalKeyword = historicalTimeKeywords.some(keyword => lowerMessage.includes(keyword));

  // 实验室相关关键词
  const labKeywords = ['实验室', '教授', '徐岗', '高飞', '顾仁树', '邬海燕', '徐金兰', '许佳敏', '肖州方', '徐钢', 'igame', '智能可视化', '计算机辅助设计', '等几何分析', '计算机视觉', '机器学习', '研究方向', '团队', '成员', '论文', '项目', '活动', '新闻', '杭州电子科技大学'];
  const hasLabKeyword = labKeywords.some(keyword => lowerMessage.includes(keyword));

  // 意图判断逻辑
  if (hasTimeKeyword && hasHistoricalKeyword) {
    return { success: true, intent: 'historical_time_query', confidence: 0.7 };
  } else if (hasTimeKeyword) {
    return { success: true, intent: 'time_query', confidence: 0.8 };
  } else if (hasLabKeyword) {
    return { success: true, intent: 'lab_related', confidence: 0.8 };
  } else {
    return { success: true, intent: 'general', confidence: 0.6 };
  }
}
