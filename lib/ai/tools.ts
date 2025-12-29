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

      if (!deepseekApiKey) {
        // 如果没有 DeepSeek API，使用简单的关键词匹配作为后备
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
1. "lab_related" - 与iGame实验室相关的问题（成员、研究方向、项目、论文、活动等）
2. "time_query" - 询问当前时间、日期的问题
3. "general" - 其他一般性问题

iGame实验室是智能可视化与仿真实验室，属于杭州电子科技大学计算机学院。主要研究方向包括：计算机辅助设计与仿真、等几何分析、计算机视觉、机器学习。

时间查询示例：
- 现在几点了？
- 今天是什么时候？
- 当前时间是什么？
- 现在是什么日期？

请根据用户问题判断意图类型，只返回JSON格式：
{"intent": "lab_related"} 或 {"intent": "time_query"} 或 {"intent": "general"}`
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
        // 如果解析失败，使用后备方法
        return fallbackIntentDetection(args.message);
      }
    } catch (error) {
      console.warn('DeepSeek intent detection failed, using fallback:', error);
      return fallbackIntentDetection(args.message);
    }
  }
};

// 后备意图检测方法（关键词匹配）
function fallbackIntentDetection(message: string): { success: boolean; intent: string; confidence: number } {
  const labKeywords = [
    'igame', '实验室', '教授', '徐岗', '计算机辅助设计', '等几何分析',
    '计算机视觉', '机器学习', '研究生', '博士', '研究', '项目',
    '论文', '学术', '活动', '新闻', '杭州电子科技大学', '计算机学院',
    '可视化', '仿真', '团队', '成员', '负责人', '规模'
  ];

  const lowerMessage = message.toLowerCase();
  const matchedKeywords = labKeywords.filter(keyword =>
    lowerMessage.includes(keyword.toLowerCase())
  );

  const confidence = Math.min(matchedKeywords.length * 0.2, 1.0);

  return {
    success: true,
    intent: confidence > 0.3 ? 'lab_related' : 'general',
    confidence
  };
}

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
