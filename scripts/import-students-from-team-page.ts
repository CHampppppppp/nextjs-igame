#!/usr/bin/env tsx

/**
 * 从团队页面导入学生数据到数据库
 * 从 app/team/page.tsx 中提取学生信息并插入到数据库
 */

import 'dotenv/config';
import { createStudent } from '../lib/db/student-repository';

// 从页面数据中提取的学生信息
const studentData = {
  // 博士研究生
  phd: [
    { name: "高健 Gao Jian", year: "2024级博士", research: "博士研究生" },
    { name: "车俊俊 Che Junjun", year: "2024级博士", research: "博士研究生" },
    { name: "胡泽楷 Hu Zekai", year: "2025级博士", research: "博士研究生" },
    { name: "高红依 Gao Hongyi", year: "2025级博士", research: "博士研究生" }
  ],

  // 硕士研究生按年级分组
  masters: {
    "2023级": [
      { name: "余政军 Yu Zhengjun", research: "硕士研究生" },
      { name: "徐松 Xu Song", research: "硕士研究生" },
      { name: "祝旭刚 Zhu Xugang", research: "硕士研究生" },
      { name: "李奥法 Li Aofa", research: "硕士研究生" },
      { name: "徐俊豪 Xu Junhao", research: "硕士研究生" },
      { name: "龚帆 Gong Fan", research: "硕士研究生" },
      { name: "陈雨航 Chen Yuhang", research: "硕士研究生" },
      { name: "冯昱新 Feng Yuxin", research: "硕士研究生" },
      { name: "田子悦 Tian Ziyue", research: "硕士研究生" },
      { name: "郑雨欣 Zheng Yuxin", research: "硕士研究生" },
      { name: "阮宇昂 Ruan Yuang", research: "硕士研究生" },
      { name: "蒋辰洋 Jiang Chenyang", research: "硕士研究生" },
      { name: "陈凯 Chen Kai", research: "硕士研究生" },
      { name: "徐将杰 Xu Jiangjie", research: "硕士研究生" },
      { name: "任怡 Ren Yi", research: "硕士研究生" },
      { name: "陈衍汝 Chen Yanru", research: "硕士研究生" },
      { name: "马楷煜 Ma Kaiyu", research: "硕士研究生" },
      { name: "张庭瑞 Zhang Tingrui", research: "硕士研究生" },
      { name: "毛鹏宇 Mao Pengyu", research: "硕士研究生" },
      { name: "陈佳亮 Chen Jialiang", research: "硕士研究生" },
      { name: "蔡晶晶 Cai Jingjing", research: "硕士研究生" },
      { name: "孙煜海 Sun Yuhai", research: "硕士研究生" }
    ],
    "2024级": [
      { name: "汪大炜 Wang Dawei", research: "硕士研究生" },
      { name: "胡卓然 Hu Zhuoran", research: "硕士研究生" },
      { name: "王仕奇 Wang Shiqi", research: "硕士研究生" },
      { name: "魏东珩 Wei Dongheng", research: "硕士研究生" },
      { name: "周国庆 Zhou Guoqing", research: "硕士研究生" },
      { name: "周耘潇 Zhou Yunxiao", research: "硕士研究生" },
      { name: "金源 Jin Yuan", research: "硕士研究生" },
      { name: "斯鹏程 Si Pengcheng", research: "硕士研究生" },
      { name: "胥玲玲 Xu Lingling", research: "硕士研究生" },
      { name: "陈星宇 Chen Xingyu", research: "硕士研究生" },
      { name: "胡端 Hu Duan", research: "硕士研究生" },
      { name: "朱圣昊 Zhu Shenghao", research: "硕士研究生" },
      { name: "毕凯霖 Bi Kailin", research: "硕士研究生" },
      { name: "林子轩 Lin Zixuan", research: "硕士研究生" },
      { name: "刘良麟 Liu Lianglin", research: "硕士研究生" },
      { name: "马迪豪 Ma Dihao", research: "硕士研究生" },
      { name: "吴钦睿 Hu Qinrui", research: "硕士研究生" },
      { name: "潘汪洋 Pan Wangyang", research: "硕士研究生" },
      { name: "陈相奕 Chen Xiangyi", research: "硕士研究生" },
      { name: "姚力行 Yao Lixing", research: "硕士研究生" },
      { name: "方毓乔 Fang Yuqiao", research: "硕士研究生" },
      { name: "何铭轩 He Mingxuan", research: "硕士研究生" },
      { name: "王钱鑫 Wang Qianxin", research: "硕士研究生" },
      { name: "朱志豪 Zhu Zhihao", research: "硕士研究生" },
      { name: "肖聪 Xiao Cong", research: "硕士研究生" },
      { name: "唐月慧 Tang Minghui", research: "硕士研究生" },
      { name: "王泽楠 Wang Zenan", research: "硕士研究生" },
      { name: "高业鹏 Gao Yapeng", research: "硕士研究生" },
      { name: "翟宇杰 Zhai Yujie", research: "硕士研究生" }
    ],
    "2025级": [
      { name: "许伦铭 Xu Lunming", research: "硕士研究生" },
      { name: "池于明 Chi Yuming", research: "硕士研究生" },
      { name: "潘哲 Pan Zhe", research: "硕士研究生" },
      { name: "张昊喆 Zhang Haozhe", research: "硕士研究生" },
      { name: "邹雪琪 Zou Xueqi", research: "硕士研究生" },
      { name: "齐佳宁 Qi Jianing", research: "硕士研究生" },
      { name: "麦梓正 Mai Zizheng", research: "硕士研究生" },
      { name: "赵嘉荣 Zhao Jiarong", research: "硕士研究生" },
      { name: "颜忠祥 Yan Zhongxiang", research: "硕士研究生" },
      { name: "王佳颖 Wang Jiaying", research: "硕士研究生" },
      { name: "胡叔翰 Hu Shuhan", research: "硕士研究生" },
      { name: "张相锴 Zhang Xiangkai", research: "硕士研究生" },
      { name: "李文柱 Li Wenzhu", research: "硕士研究生" },
      { name: "蒋志燕 Jiang Zhiyan", research: "硕士研究生" },
      { name: "张天荣 Zhang Tianrong", research: "硕士研究生" },
      { name: "南骅家 Nan Huajia", research: "硕士研究生" },
      { name: "陈品文 Chen Pinwen", research: "硕士研究生" },
      { name: "蔡雨奇 Cai Yuqi", research: "硕士研究生" },
      { name: "徐建博 Xu Jianbo", research: "硕士研究生" },
      { name: "李昊宸 Li Haochen", research: "硕士研究生" },
      { name: "谢文凯 Xie Wenkai", research: "硕士研究生" },
      { name: "章辰 Zhang Chen", research: "硕士研究生" },
      { name: "王聪 Wang Cong", research: "硕士研究生" },
      { name: "袁一骏 Yuan Yijun", research: "硕士研究生" },
      { name: "沈弋程 Shen Yicheng", research: "硕士研究生" },
      { name: "叶煊驰 Ye Xuanchi", research: "硕士研究生" },
      { name: "顾博文 Gu Bowen", research: "硕士研究生" },
      { name: "陈子豪 Chen Zihao", research: "硕士研究生" },
      { name: "孙鹏 Sun Peng", research: "硕士研究生" },
      { name: "蒋天律 Jiang Tianlu", research: "硕士研究生" },
      { name: "贾缤 Jia Bing", research: "硕士研究生" },
      { name: "潘帅宏 Pan Shuaihong", research: "硕士研究生" },
      { name: "王艺锦 Wang Yijin", research: "硕士研究生" },
      { name: "金睿诚 Jin Ruicheng", research: "硕士研究生" },
      { name: "陈诺 Chen Nuo", research: "硕士研究生" },
      { name: "李忠毅 Li Zhongyi", research: "硕士研究生" }
    ]
  }
};

// 生成学生ID的辅助函数
function generateStudentId(fullName: string): string {
  // 从姓名中提取英文名作为ID
  const parts = fullName.split(' ');
  if (parts.length >= 2) {
    // 如果有英文名，使用英文名的小写形式
    const englishName = parts.slice(1).join('_').toLowerCase();
    return englishName;
  } else {
    // 如果只有中文名，使用中文名
    return fullName.replace(/\s+/g, '_');
  }
}

// 解析学生姓名，返回中文名和英文名
function parseStudentName(fullName: string): { chineseName: string; englishName?: string } {
  const parts = fullName.split(' ');
  if (parts.length >= 2) {
    const chineseName = parts[0];
    const englishName = parts.slice(1).join(' ');
    return { chineseName, englishName };
  } else {
    return { chineseName: fullName };
  }
}

// 解析年级和学位
function parseGradeAndDegree(yearGrade: string): { grade: string; degree: string } {
  if (yearGrade.includes('博士')) {
    return {
      grade: yearGrade,
      degree: '博士研究生'
    };
  } else if (yearGrade.includes('硕士')) {
    return {
      grade: yearGrade,
      degree: '硕士研究生'
    };
  } else {
    // 对于硕士研究生，根据年级推断
    return {
      grade: yearGrade + '硕士',
      degree: '硕士研究生'
    };
  }
}

async function importStudents() {
  console.log('🚀 开始导入学生数据到数据库...\n');

  let importedCount = 0;
  let skippedCount = 0;

  try {
    // 处理博士研究生
    console.log('📚 处理博士研究生数据...');
    for (const student of studentData.phd) {
      const { chineseName, englishName } = parseStudentName(student.name);
      const { grade, degree } = parseGradeAndDegree(student.year);
      const id = generateStudentId(student.name);

      try {
        await createStudent({
          id,
          chineseName,
          englishName,
          grade,
          degree,
          research: student.research,
          bio: `iGame Lab ${degree}，研究方向：${student.research}`,
        });
        console.log(`✅ 已创建: ${chineseName} (${id})`);
        importedCount++;
      } catch (error) {
        console.log(`⚠️  跳过: ${chineseName} (${id}) - 可能已存在`);
        skippedCount++;
      }
    }

    // 处理硕士研究生
    console.log('\n📖 处理硕士研究生数据...');
    for (const [year, students] of Object.entries(studentData.masters)) {
      console.log(`\n--- ${year} ---`);
      for (const student of students) {
        const { chineseName, englishName } = parseStudentName(student.name);
        const { grade, degree } = parseGradeAndDegree(year);
        const id = generateStudentId(student.name);

        try {
          await createStudent({
            id,
            chineseName,
            englishName,
            grade,
            degree,
            research: student.research,
            bio: `iGame Lab ${degree}，研究方向：${student.research}`,
          });
          console.log(`✅ 已创建: ${chineseName} (${id})`);
          importedCount++;
        } catch (error) {
          console.log(`⚠️  跳过: ${chineseName} (${id}) - 可能已存在`);
          skippedCount++;
        }
      }
    }

    console.log('\n🎉 学生数据导入完成！');
    console.log(`📊 统计信息:`);
    console.log(`  ✅ 成功导入: ${importedCount} 位学生`);
    console.log(`  ⚠️  跳过: ${skippedCount} 位学生（可能已存在）`);
    console.log(`  📈 总计: ${importedCount + skippedCount} 位学生`);

  } catch (error) {
    console.error('❌ 导入失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  importStudents().catch((error) => {
    console.error('脚本执行失败:', error);
    process.exit(1);
  });
}

export { importStudents };
