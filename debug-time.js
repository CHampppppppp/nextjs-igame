// 调试时间查询关键词匹配
const message = '今天是什么时候？';
const timeKeywords = ['时间', '日期', '时候', '几点', '现在几点', '几点了', '当前时间', '现在时间', '当前日期', '现在日期', 'what time', 'time now', 'current time', 'what date', 'current date'];

const isTimeQuery = timeKeywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()));

console.log('Message:', message);
console.log('Is time query:', isTimeQuery);
console.log('Matched keywords:', timeKeywords.filter(keyword => message.toLowerCase().includes(keyword.toLowerCase())));

// 测试其他查询
const testMessages = [
    '现在几点了？',
    '今天是几号？',
    '现在是什么时间？',
    'current time',
    'what time is it?'
];

testMessages.forEach(msg => {
    const matched = timeKeywords.filter(keyword => msg.toLowerCase().includes(keyword.toLowerCase()));
    console.log(`"${msg}" -> ${matched.length > 0} [${matched.join(', ')}]`);
});
