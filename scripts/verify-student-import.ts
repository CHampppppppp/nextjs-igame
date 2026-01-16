#!/usr/bin/env tsx

/**
 * 验证学生数据导入结果
 */

import 'dotenv/config';
import { getAllStudents, getStudentsByGrade } from '../lib/db/student-repository';

async function verifyImport() {
  console.log('🔍 验证学生数据导入结果...\n');

  try {
    // 获取所有学生
    const allStudents = await getAllStudents();
    console.log(`📊 数据库中的学生总数: ${allStudents.length}`);

    // 按学位统计
    const degreeStats = allStudents.reduce((acc, student) => {
      acc[student.degree] = (acc[student.degree] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n🎓 按学位统计:');
    Object.entries(degreeStats).forEach(([degree, count]) => {
      console.log(`  ${degree}: ${count} 位`);
    });

    // 按年级统计
    const gradeStats = allStudents.reduce((acc, student) => {
      acc[student.grade] = (acc[student.grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n📅 按年级统计:');
    Object.entries(gradeStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([grade, count]) => {
        console.log(`  ${grade}: ${count} 位`);
      });

    // 检查特定学生是否存在
    console.log('\n🔍 检查特定学生:');
    const testStudents = [
      { name: '车俊俊', id: 'che_junjun' },
      { name: '高健', id: 'gao_jian' },
      { name: '余政军', id: 'yu_zhengjun' },
      { name: '汪大炜', id: 'wang_dawei' },
      { name: '许伦铭', id: 'xu_lunming' }
    ];

    testStudents.forEach(({ name, id }) => {
      const student = allStudents.find(s => s.id === id);
      if (student) {
        console.log(`  ✅ ${name} (${id}): ${student.chineseName} - ${student.grade} ${student.degree}`);
      } else {
        console.log(`  ❌ ${name} (${id}): 未找到`);
      }
    });

    // 显示前10个学生作为示例
    console.log('\n📝 前10位学生示例:');
    allStudents.slice(0, 10).forEach((student, index) => {
      console.log(`  ${index + 1}. ${student.chineseName}${student.englishName ? ` (${student.englishName})` : ''} - ${student.grade} ${student.degree}`);
    });

    console.log('\n🎉 验证完成！所有学生数据已成功导入到数据库中。');

  } catch (error) {
    console.error('❌ 验证失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  verifyImport().catch((error) => {
    console.error('脚本执行失败:', error);
    process.exit(1);
  });
}

export { verifyImport };
