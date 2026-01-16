#!/usr/bin/env tsx

/**
 * 从 team/page.tsx 导入学生数据到数据库
 */

import 'dotenv/config';
import { createStudent } from '../lib/db/student-repository';

// 从 team/page.tsx 提取的学生数据
const graduateStudents = {
  phd: [
    { id: "gao_jian", name: "高健 Gao Jian", year: "2024级博士", research: "博士研究生" },
    { id: "che_junjun", name: "车俊俊 Che Junjun", year: "2024级博士", research: "博士研究生" },
    { id: "hu_zekai", name: "胡泽楷 Hu Zekai", year: "2025级博士", research: "博士研究生" },
    { id: "gao_hongyi", name: "高红依 Gao Hongyi", year: "2025级博士", research: "博士研究生" }
  ],
  masters: {
    "2023级": [
      { id: "yu_zhengjun", name: "余政军 Yu Zhengjun", research: "硕士研究生" },
      { id: "xu_song", name: "徐松 Xu Song", research: "硕士研究生" },
      { id: "zhu_xugang", name: "祝旭刚 Zhu Xugang", research: "硕士研究生" },
      { id: "li_aofa", name: "李奥法 Li Aofa", research: "硕士研究生" },
      { id: "xu_junhao", name: "徐俊豪 Xu Junhao", research: "硕士研究生" },
      { id: "gong_fan", name: "龚帆 Gong Fan", research: "硕士研究生" },
      { id: "chen_yuhang", name: "陈雨航 Chen Yuhang", research: "硕士研究生" },
      { id: "feng_yuxin", name: "冯昱新 Feng Yuxin", research: "硕士研究生" },
      { id: "tian_ziyue", name: "田子悦 Tian Ziyue", research: "硕士研究生" },
      { id: "zheng_yuxin", name: "郑雨欣 Zheng Yuxin", research: "硕士研究生" },
      { id: "ruan_yuang", name: "阮宇昂 Ruan Yuang", research: "硕士研究生" },
      { id: "jiang_chenyang", name: "蒋辰洋 Jiang Chenyang", research: "硕士研究生" },
      { id: "chen_kai", name: "陈凯 Chen Kai", research: "硕士研究生" },
      { id: "xu_jiangjie", name: "徐将杰 Xu Jiangjie", research: "硕士研究生" },
      { id: "ren_yi", name: "任怡 Ren Yi", research: "硕士研究生" },
      { id: "chen_yanru", name: "陈衍汝 Chen Yanru", research: "硕士研究生" },
      { id: "ma_kaiyu", name: "马楷煜 Ma Kaiyu", research: "硕士研究生" },
      { id: "zhang_tingrui", name: "张庭瑞 Zhang Tingrui", research: "硕士研究生" },
      { id: "mao_pengyu", name: "毛鹏宇 Mao Pengyu", research: "硕士研究生" },
      { id: "chen_jialiang", name: "陈佳亮 Chen Jialiang", research: "硕士研究生" },
      { id: "cai_jingjing", name: "蔡晶晶 Cai Jingjing", research: "硕士研究生" },
      { id: "sun_yuhai", name: "孙煜海 Sun Yuhai", research: "硕士研究生" }
    ],
    "2024级": [
      { id: "wang_dawei", name: "汪大炜 Wang Dawei", research: "硕士研究生" },
      { id: "hu_zhuoran", name: "胡卓然 Hu Zhuoran", research: "硕士研究生" },
      { id: "wang_shiqi", name: "王仕奇 Wang Shiqi", research: "硕士研究生" },
      { id: "wei_dongheng", name: "魏东珩 Wei Dongheng", research: "硕士研究生" },
      { id: "zhou_guoqing", name: "周国庆 Zhou Guoqing", research: "硕士研究生" },
      { id: "zhou_yunxiao", name: "周耘潇 Zhou Yunxiao", research: "硕士研究生" },
      { id: "jin_yuan", name: "金源 Jin Yuan", research: "硕士研究生" },
      { id: "si_pengcheng", name: "斯鹏程 Si Pengcheng", research: "硕士研究生" },
      { id: "xu_lingling", name: "胥玲玲 Xu Lingling", research: "硕士研究生" },
      { id: "chen_xingyu", name: "陈星宇 Chen Xingyu", research: "硕士研究生" },
      { id: "hu_duan", name: "胡端 Hu Duan", research: "硕士研究生" },
      { id: "zhu_shenghao", name: "朱圣昊 Zhu Shenghao", research: "硕士研究生" },
      { id: "bi_kailin", name: "毕凯霖 Bi Kailin", research: "硕士研究生" },
      { id: "lin_zixuan", name: "林子轩 Lin Zixuan", research: "硕士研究生" },
      { id: "liu_lianglin", name: "刘良麟 Liu Lianglin", research: "硕士研究生" },
      { id: "ma_dihao", name: "马迪豪 Ma Dihao", research: "硕士研究生" },
      { id: "hu_qinrui", name: "吴钦睿 Hu Qinrui", research: "硕士研究生" },
      { id: "pan_wangyang", name: "潘汪洋 Pan Wangyang", research: "硕士研究生" },
      { id: "chen_xiangyi", name: "陈相奕 Chen Xiangyi", research: "硕士研究生" },
      { id: "yao_lixing", name: "姚力行 Yao Lixing", research: "硕士研究生" },
      { id: "fang_yuqiao", name: "方毓乔 Fang Yuqiao", research: "硕士研究生" },
      { id: "he_mingxuan", name: "何铭轩 He Mingxuan", research: "硕士研究生" },
      { id: "wang_qianxin", name: "王钱鑫 Wang Qianxin", research: "硕士研究生" },
      { id: "zhu_zhihao", name: "朱志豪 Zhu Zhihao", research: "硕士研究生" },
      { id: "xiao_cong", name: "肖聪 Xiao Cong", research: "硕士研究生" },
      { id: "tang_minghui", name: "唐月慧 Tang Minghui", research: "硕士研究生" },
      { id: "wang_zenan", name: "王泽楠 Wang Zenan", research: "硕士研究生" },
      { id: "gao_yapeng", name: "高业鹏 Gao Yapeng", research: "硕士研究生" },
      { id: "zhai_yujie", name: "翟宇杰 Zhai Yujie", research: "硕士研究生" }
    ],
    "2025级": [
      { id: "xu_lunming", name: "许伦铭 Xu Lunming", research: "硕士研究生" },
      { id: "chi_yuming", name: "池于明 Chi Yuming", research: "硕士研究生" },
      { id: "pan_zhe", name: "潘哲 Pan Zhe", research: "硕士研究生" },
      { id: "zhang_haozhe", name: "张昊喆 Zhang Haozhe", research: "硕士研究生" },
      { id: "zou_xueqi", name: "邹雪琪 Zou Xueqi", research: "硕士研究生" },
      { id: "qi_jianing", name: "齐佳宁 Qi Jianing", research: "硕士研究生" },
      { id: "mai_zizheng", name: "麦梓正 Mai Zizheng", research: "硕士研究生" },
      { id: "zhao_jiarong", name: "赵嘉荣 Zhao Jiarong", research: "硕士研究生" },
      { id: "yan_zhongxiang", name: "颜忠祥 Yan Zhongxiang", research: "硕士研究生" },
      { id: "wang_jiaying", name: "王佳颖 Wang Jiaying", research: "硕士研究生" },
      { id: "hu_shuhan", name: "胡叔翰 Hu Shuhan", research: "硕士研究生" },
      { id: "zhang_xiangkai", name: "张相锴 Zhang Xiangkai", research: "硕士研究生" },
      { id: "li_wenzhu", name: "李文柱 Li Wenzhu", research: "硕士研究生" },
      { id: "jiang_zhiyan", name: "蒋志燕 Jiang Zhiyan", research: "硕士研究生" },
      { id: "zhang_tianrong", name: "张天荣 Zhang Tianrong", research: "硕士研究生" },
      { id: "nan_huajia", name: "南骅家 Nan Huajia", research: "硕士研究生" },
      { id: "chen_pinwen", name: "陈品文 Chen Pinwen", research: "硕士研究生" },
      { id: "cai_yuqi", name: "蔡雨奇 Cai Yuqi", research: "硕士研究生" },
      { id: "xu_jianbo", name: "徐建博 Xu Jianbo", research: "硕士研究生" },
      { id: "li_haochen", name: "李昊宸 Li Haochen", research: "硕士研究生" },
      { id: "xie_wenkai", name: "谢文凯 Xie Wenkai", research: "硕士研究生" },
      { id: "zhang_chen", name: "章辰 Zhang Chen", research: "硕士研究生" },
      { id: "wang_cong", name: "王聪 Wang Cong", research: "硕士研究生" },
      { id: "yuan_yijun", name: "袁一骏 Yuan Yijun", research: "硕士研究生" },
      { id: "shen_yicheng", name: "沈弋程 Shen Yicheng", research: "硕士研究生" },
      { id: "ye_xuanchi", name: "叶煊驰 Ye Xuanchi", research: "硕士研究生" },
      { id: "gu_bowen", name: "顾博文 Gu Bowen", research: "硕士研究生" },
      { id: "chen_zihao", name: "陈子豪 Chen Zihao", research: "硕士研究生" },
      { id: "sun_peng", name: "孙鹏 Sun Peng", research: "硕士研究生" },
      { id: "jiang_tianlu", name: "蒋天律 Jiang Tianlu", research: "硕士研究生" },
      { id: "jia_bing", name: "贾缤 Jia Bing", research: "硕士研究生" },
      { id: "pan_shuaihong", name: "潘帅宏 Pan Shuaihong", research: "硕士研究生" },
      { id: "wang_yijin", name: "王艺锦 Wang Yijin", research: "硕士研究生" },
      { id: "jin_ruicheng", name: "金睿诚 Jin Ruicheng", research: "硕士研究生" },
      { id: "chen_nuo", name: "陈诺 Chen Nuo", research: "硕士研究生" },
      { id: "li_zhongyi", name: "李忠毅 Li Zhongyi", research: "硕士研究生" }
    ]
  }
};

// 辅助函数：从学生姓名中提取中文名和英文名
function parseStudentName(fullName: string): { chineseName: string; englishName?: string } {
  // 假设格式为 "中文名 英文名" 或 "中文名"
  const parts = fullName.trim().split(' ');
  if (parts.length >= 2) {
    const chineseName = parts[0];
    const englishName = parts.slice(1).join(' ');
    return { chineseName, englishName };
  } else {
    return { chineseName: fullName };
  }
}

// 辅助函数：从年级字符串中提取年级和学位
function parseGradeAndDegree(yearString: string, gradeKey?: string): { grade: string; degree: string } {
  if (yearString.includes('博士')) {
    // 博士研究生，如 "2024级博士" -> grade: "2024级博士", degree: "博士研究生"
    return { grade: yearString, degree: '博士研究生' };
  } else if (yearString.includes('硕士')) {
    // 硕士研究生，如 "2023级" -> grade: "2023级硕士", degree: "硕士研究生"
    const grade = gradeKey ? `${gradeKey}硕士` : yearString;
    return { grade, degree: '硕士研究生' };
  } else if (gradeKey) {
    // 从年级键推断，如 "2023级" -> "2023级硕士"
    return { grade: `${gradeKey}硕士`, degree: '硕士研究生' };
  } else {
    return { grade: yearString, degree: '硕士研究生' };
  }
}

async function importStudents() {
  console.log('🚀 开始导入学生数据到数据库...\n');

  const allStudents = [];
  let successCount = 0;
  let errorCount = 0;

  // 处理博士研究生
  console.log('📚 处理博士研究生数据...');
  for (const student of graduateStudents.phd) {
    try {
      const { chineseName, englishName } = parseStudentName(student.name);
      const { grade, degree } = parseGradeAndDegree(student.year);

      const studentData = {
        id: student.id,
        chineseName,
        englishName,
        grade,
        degree,
        bio: `iGame Lab ${degree}，专注于相关领域的研究工作。`,
        research: student.research,
      };

      await createStudent(studentData);
      allStudents.push(studentData);
      successCount++;
      console.log(`✅ ${chineseName} (${student.id}) - ${grade}`);
    } catch (error) {
      console.error(`❌ 导入失败 ${student.name}:`, error);
      errorCount++;
    }
  }

  // 处理硕士研究生
  console.log('\n📖 处理硕士研究生数据...');
  for (const [gradeKey, students] of Object.entries(graduateStudents.masters)) {
    console.log(`\n--- ${gradeKey} ---`);
    for (const student of students) {
      try {
        const { chineseName, englishName } = parseStudentName(student.name);
        const { grade, degree } = parseGradeAndDegree(student.research, gradeKey);

        const studentData = {
          id: student.id,
          chineseName,
          englishName,
          grade,
          degree,
          bio: `iGame Lab ${degree}，专注于相关领域的研究工作。`,
          research: student.research,
        };

        await createStudent(studentData);
        allStudents.push(studentData);
        successCount++;
        console.log(`✅ ${chineseName} (${student.id}) - ${grade}`);
      } catch (error) {
        console.error(`❌ 导入失败 ${student.name}:`, error);
        errorCount++;
      }
    }
  }

  console.log('\n🎉 导入完成！');
  console.log(`📊 总计: ${allStudents.length} 名学生`);
  console.log(`✅ 成功: ${successCount} 名`);
  console.log(`❌ 失败: ${errorCount} 名`);

  if (successCount > 0) {
    console.log('\n📋 导入的学生年级分布:');
    const gradeStats = allStudents.reduce((acc, student) => {
      acc[student.grade] = (acc[student.grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(gradeStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([grade, count]) => {
        console.log(`  ${grade}: ${count} 名学生`);
      });
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  importStudents().catch((error) => {
    console.error('❌ 脚本执行失败:', error);
    process.exit(1);
  });
}

export { importStudents };
