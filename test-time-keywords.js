// 测试时间关键词匹配
const message = '现在是什么日期';
const timeKeywords = ['时间', '日期', '现在几点', '几点了', '当前时间', '现在时间', '当前日期', '现在日期', 'what time', 'time now', 'current time', 'what date', 'current date'];

const isTimeQuery = timeKeywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()));

console.log('Message:', message);
console.log('Is time query:', isTimeQuery);
console.log('Matched keywords:', timeKeywords.filter(keyword => message.toLowerCase().includes(keyword.toLowerCase())));
