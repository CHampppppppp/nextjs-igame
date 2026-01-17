'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, HoverEffect } from "../components/layout/page-transition";
import { useScrollAnimation, scrollAnimationPresets } from "../../hooks/use-scroll-animation";

// 教师团队数据
const facultyMembers = [
  {
    id: "xugang",
    name: "徐岗 Xu Gang",
    title: "教授，博导",
    research: "三维数字化建模、计算机视觉",
    image: "/images/team/team-xugang.jpg",
    link: "https://faculty.hdu.edu.cn/jsjxy/xg/main.htm"
  },
  {
    id: "xujinlan",
    name: "许金兰 Xu Jinlan",
    title: "副教授，硕导",
    research: "工业软件开发、数值仿真",
    image: "/images/team/team-xujinlan.jpg",
    link: "https://faculty.hdu.edu.cn/jsjxy/xjl/main.htm"
  },
  {
    id: "xiaozhoufang",
    name: "肖周芳 Xiao Zhoufang",
    title: "副教授，硕导",
    research: "等几何分析、拓扑优化",
    image: "/images/team/team-xzf.jpg",
    link: "https://faculty.hdu.edu.cn/jsjxy/xzf/main.htm"
  },
  {
    id: "gurenshu",
    name: "顾人舒 Gu Renshu",
    title: "副教授，博士",
    research: "深度学习、机器视觉",
    image: "/images/team/team-gurenshu.jpg",
    link: "https://faculty.hdu.edu.cn/jsjxy/grs/main.htm"
  },
  // {
  //   id: "gaofei",
  //   name: "高飞 Gao Fei",
  //   title: "副教授",
  //   research: "网格生成、自适应算法",
  //   image: "/images/team/team-gaofei.jpg"
  // },
  {
    id: "wuhaiyan",
    name: "吴海燕 Wu Haiyan",
    title: "讲师，博士",
    research: "计算机图形学、虚拟现实",
    image: "/images/team/team-wuhaiyan.jpg",
    link: "https://faculty.hdu.edu.cn/jsjxy/why2/main.htm"
  },
  {
    id: "xujiamin",
    name: "许佳敏 Xu Jiamin",
    title: "讲师，硕导",
    research: "人工智能、模式识别",
    image: "/images/team/team-xujiamin.jpg",
    link: "https://faculty.hdu.edu.cn/jsjxy/xjm/main.htm"
  },
  {
    id: "caoyajun",
    name: "曹亚军 Cao Yajun",
    title: "特聘副研究员",
    research: "计算流体力学、多物理场耦合",
    image: "/images/team/team-caoyajun.jpg"
  }
];

// 生成学生ID的辅助函数
function generateStudentId(name: string): string {
  // 从中文名中提取拼音或英文名作为ID
  const parts = name.split(' ');
  if (parts.length >= 2) {
    // 如果有英文名，使用英文名的小写形式
    const englishName = parts.slice(1).join('_').toLowerCase();
    return englishName;
  } else {
    // 如果只有中文名，使用中文名
    return name.replace(/\s+/g, '_');
  }
}

// 研究生数据（按年级分组）
const graduateStudents = {
  phd: [
    { id: generateStudentId("高健 Gao Jian"), name: "高健 Gao Jian", year: "2024级博士", research: "博士研究生" },
    { id: generateStudentId("车俊俊 Che Junjun"), name: "车俊俊 Che Junjun", year: "2024级博士", research: "博士研究生" },
    { id: generateStudentId("胡泽楷 Hu Zekai"), name: "胡泽楷 Hu Zekai", year: "2025级博士", research: "博士研究生" },
    { id: generateStudentId("高红依 Gao Hongyi"), name: "高红依 Gao Hongyi", year: "2025级博士", research: "博士研究生" }
  ],
  masters: {
    "2023级": [
      { id: generateStudentId("余政军 Yu Zhengjun"), name: "余政军 Yu Zhengjun", research: "硕士研究生" },
      { id: generateStudentId("徐松 Xu Song"), name: "徐松 Xu Song", research: "硕士研究生" },
      { id: generateStudentId("祝旭刚 Zhu Xugang"), name: "祝旭刚 Zhu Xugang", research: "硕士研究生" },
      { id: generateStudentId("李奥法 Li Aofa"), name: "李奥法 Li Aofa", research: "硕士研究生" },
      { id: generateStudentId("徐俊豪 Xu Junhao"), name: "徐俊豪 Xu Junhao", research: "硕士研究生" },
      { id: generateStudentId("龚帆 Gong Fan"), name: "龚帆 Gong Fan", research: "硕士研究生" },
      { id: generateStudentId("陈雨航 Chen Yuhang"), name: "陈雨航 Chen Yuhang", research: "硕士研究生" },
      { id: generateStudentId("冯昱新 Feng Yuxin"), name: "冯昱新 Feng Yuxin", research: "硕士研究生" },
      { id: generateStudentId("田子悦 Tian Ziyue"), name: "田子悦 Tian Ziyue", research: "硕士研究生" },
      { id: generateStudentId("郑雨欣 Zheng Yuxin"), name: "郑雨欣 Zheng Yuxin", research: "硕士研究生" },
      { id: generateStudentId("阮宇昂 Ruan Yuang"), name: "阮宇昂 Ruan Yuang", research: "硕士研究生" },
      { id: generateStudentId("蒋辰洋 Jiang Chenyang"), name: "蒋辰洋 Jiang Chenyang", research: "硕士研究生" },
      { id: generateStudentId("陈凯 Chen Kai"), name: "陈凯 Chen Kai", research: "硕士研究生" },
      { id: generateStudentId("徐将杰 Xu Jiangjie"), name: "徐将杰 Xu Jiangjie", research: "硕士研究生" },
      { id: generateStudentId("任怡 Ren Yi"), name: "任怡 Ren Yi", research: "硕士研究生" },
      { id: generateStudentId("陈衍汝 Chen Yanru"), name: "陈衍汝 Chen Yanru", research: "硕士研究生" },
      { id: generateStudentId("马楷煜 Ma Kaiyu"), name: "马楷煜 Ma Kaiyu", research: "硕士研究生" },
      { id: generateStudentId("张庭瑞 Zhang Tingrui"), name: "张庭瑞 Zhang Tingrui", research: "硕士研究生" },
      { id: generateStudentId("毛鹏宇 Mao Pengyu"), name: "毛鹏宇 Mao Pengyu", research: "硕士研究生" },
      { id: generateStudentId("陈佳亮 Chen Jialiang"), name: "陈佳亮 Chen Jialiang", research: "硕士研究生" },
      { id: generateStudentId("蔡晶晶 Cai Jingjing"), name: "蔡晶晶 Cai Jingjing", research: "硕士研究生" },
      { id: generateStudentId("孙煜海 Sun Yuhai"), name: "孙煜海 Sun Yuhai", research: "硕士研究生" }
    ],
    "2024级": [
      { id: generateStudentId("汪大炜 Wang Dawei"), name: "汪大炜 Wang Dawei", research: "硕士研究生" },
      { id: generateStudentId("胡卓然 Hu Zhuoran"), name: "胡卓然 Hu Zhuoran", research: "硕士研究生" },
      { id: generateStudentId("王仕奇 Wang Shiqi"), name: "王仕奇 Wang Shiqi", research: "硕士研究生" },
      { id: generateStudentId("魏东珩 Wei Dongheng"), name: "魏东珩 Wei Dongheng", research: "硕士研究生" },
      { id: generateStudentId("周国庆 Zhou Guoqing"), name: "周国庆 Zhou Guoqing", research: "硕士研究生" },
      { id: generateStudentId("周耘潇 Zhou Yunxiao"), name: "周耘潇 Zhou Yunxiao", research: "硕士研究生" },
      { id: generateStudentId("金源 Jin Yuan"), name: "金源 Jin Yuan", research: "硕士研究生" },
      { id: generateStudentId("斯鹏程 Si Pengcheng"), name: "斯鹏程 Si Pengcheng", research: "硕士研究生" },
      { id: generateStudentId("胥玲玲 Xu Lingling"), name: "胥玲玲 Xu Lingling", research: "硕士研究生" },
      { id: generateStudentId("陈星宇 Chen Xingyu"), name: "陈星宇 Chen Xingyu", research: "硕士研究生" },
      { id: generateStudentId("胡端 Hu Duan"), name: "胡端 Hu Duan", research: "硕士研究生" },
      { id: generateStudentId("朱圣昊 Zhu Shenghao"), name: "朱圣昊 Zhu Shenghao", research: "硕士研究生" },
      { id: generateStudentId("毕凯霖 Bi Kailin"), name: "毕凯霖 Bi Kailin", research: "硕士研究生" },
      { id: generateStudentId("林子轩 Lin Zixuan"), name: "林子轩 Lin Zixuan", research: "硕士研究生" },
      { id: generateStudentId("刘良麟 Liu Lianglin"), name: "刘良麟 Liu Lianglin", research: "硕士研究生" },
      { id: generateStudentId("马迪豪 Ma Dihao"), name: "马迪豪 Ma Dihao", research: "硕士研究生" },
      { id: generateStudentId("吴钦睿 Hu Qinrui"), name: "吴钦睿 Hu Qinrui", research: "硕士研究生" },
      { id: generateStudentId("潘汪洋 Pan Wangyang"), name: "潘汪洋 Pan Wangyang", research: "硕士研究生" },
      { id: generateStudentId("陈相奕 Chen Xiangyi"), name: "陈相奕 Chen Xiangyi", research: "硕士研究生" },
      { id: generateStudentId("姚力行 Yao Lixing"), name: "姚力行 Yao Lixing", research: "硕士研究生" },
      { id: generateStudentId("方毓乔 Fang Yuqiao"), name: "方毓乔 Fang Yuqiao", research: "硕士研究生" },
      { id: generateStudentId("何铭轩 He Mingxuan"), name: "何铭轩 He Mingxuan", research: "硕士研究生" },
      { id: generateStudentId("王钱鑫 Wang Qianxin"), name: "王钱鑫 Wang Qianxin", research: "硕士研究生" },
      { id: generateStudentId("朱志豪 Zhu Zhihao"), name: "朱志豪 Zhu Zhihao", research: "硕士研究生" },
      { id: generateStudentId("肖聪 Xiao Cong"), name: "肖聪 Xiao Cong", research: "硕士研究生" },
      { id: generateStudentId("唐月慧 Tang Minghui"), name: "唐月慧 Tang Minghui", research: "硕士研究生" },
      { id: generateStudentId("王泽楠 Wang Zenan"), name: "王泽楠 Wang Zenan", research: "硕士研究生" },
      { id: generateStudentId("高业鹏 Gao Yapeng"), name: "高业鹏 Gao Yapeng", research: "硕士研究生" },
      { id: generateStudentId("翟宇杰 Zhai Yujie"), name: "翟宇杰 Zhai Yujie", research: "硕士研究生" }
    ],
    "2025级": [
      { id: generateStudentId("许伦铭 Xu Lunming"), name: "许伦铭 Xu Lunming", research: "硕士研究生" },
      { id: generateStudentId("池于明 Chi Yuming"), name: "池于明 Chi Yuming", research: "硕士研究生" },
      { id: generateStudentId("潘哲 Pan Zhe"), name: "潘哲 Pan Zhe", research: "硕士研究生" },
      { id: generateStudentId("张昊喆 Zhang Haozhe"), name: "张昊喆 Zhang Haozhe", research: "硕士研究生" },
      { id: generateStudentId("邹雪琪 Zou Xueqi"), name: "邹雪琪 Zou Xueqi", research: "硕士研究生" },
      { id: generateStudentId("齐佳宁 Qi Jianing"), name: "齐佳宁 Qi Jianing", research: "硕士研究生" },
      { id: generateStudentId("麦梓正 Mai Zizheng"), name: "麦梓正 Mai Zizheng", research: "硕士研究生" },
      { id: generateStudentId("赵嘉荣 Zhao Jiarong"), name: "赵嘉荣 Zhao Jiarong", research: "硕士研究生" },
      { id: generateStudentId("颜忠祥 Yan Zhongxiang"), name: "颜忠祥 Yan Zhongxiang", research: "硕士研究生" },
      { id: generateStudentId("王佳颖 Wang Jiaying"), name: "王佳颖 Wang Jiaying", research: "硕士研究生" },
      { id: generateStudentId("胡叔翰 Hu Shuhan"), name: "胡叔翰 Hu Shuhan", research: "硕士研究生" },
      { id: generateStudentId("张相锴 Zhang Xiangkai"), name: "张相锴 Zhang Xiangkai", research: "硕士研究生" },
      { id: generateStudentId("李文柱 Li Wenzhu"), name: "李文柱 Li Wenzhu", research: "硕士研究生" },
      { id: generateStudentId("蒋志燕 Jiang Zhiyan"), name: "蒋志燕 Jiang Zhiyan", research: "硕士研究生" },
      { id: generateStudentId("张天荣 Zhang Tianrong"), name: "张天荣 Zhang Tianrong", research: "硕士研究生" },
      { id: generateStudentId("南骅家 Nan Huajia"), name: "南骅家 Nan Huajia", research: "硕士研究生" },
      { id: generateStudentId("陈品文 Chen Pinwen"), name: "陈品文 Chen Pinwen", research: "硕士研究生" },
      { id: generateStudentId("蔡雨奇 Cai Yuqi"), name: "蔡雨奇 Cai Yuqi", research: "硕士研究生" },
      { id: generateStudentId("徐建博 Xu Jianbo"), name: "徐建博 Xu Jianbo", research: "硕士研究生" },
      { id: generateStudentId("李昊宸 Li Haochen"), name: "李昊宸 Li Haochen", research: "硕士研究生" },
      { id: generateStudentId("谢文凯 Xie Wenkai"), name: "谢文凯 Xie Wenkai", research: "硕士研究生" },
      { id: generateStudentId("章辰 Zhang Chen"), name: "章辰 Zhang Chen", research: "硕士研究生" },
      { id: generateStudentId("王聪 Wang Cong"), name: "王聪 Wang Cong", research: "硕士研究生" },
      { id: generateStudentId("袁一骏 Yuan Yijun"), name: "袁一骏 Yuan Yijun", research: "硕士研究生" },
      { id: generateStudentId("沈弋程 Shen Yicheng"), name: "沈弋程 Shen Yicheng", research: "硕士研究生" },
      { id: generateStudentId("叶煊驰 Ye Xuanchi"), name: "叶煊驰 Ye Xuanchi", research: "硕士研究生" },
      { id: generateStudentId("顾博文 Gu Bowen"), name: "顾博文 Gu Bowen", research: "硕士研究生" },
      { id: generateStudentId("陈子豪 Chen Zihao"), name: "陈子豪 Chen Zihao", research: "硕士研究生" },
      { id: generateStudentId("孙鹏 Sun Peng"), name: "孙鹏 Sun Peng", research: "硕士研究生" },
      { id: generateStudentId("蒋天律 Jiang Tianlu"), name: "蒋天律 Jiang Tianlu", research: "硕士研究生" },
      { id: generateStudentId("贾缤 Jia Bing"), name: "贾缤 Jia Bing", research: "硕士研究生" },
      { id: generateStudentId("潘帅宏 Pan Shuaihong"), name: "潘帅宏 Pan Shuaihong", research: "硕士研究生" },
      { id: generateStudentId("王艺锦 Wang Yijin"), name: "王艺锦 Wang Yijin", research: "硕士研究生" },
      { id: generateStudentId("金睿诚 Jin Ruicheng"), name: "金睿诚 Jin Ruicheng", research: "硕士研究生" },
      { id: generateStudentId("陈诺 Chen Nuo"), name: "陈诺 Chen Nuo", research: "硕士研究生" },
      { id: generateStudentId("李忠毅 Li Zhongyi"), name: "李忠毅 Li Zhongyi", research: "硕士研究生" }
    ]
  }
};

// 教师卡片组件 - 简约设计
function FacultyCard({ member }: { member: typeof facultyMembers[0] }) {
  return (
    <ScrollReveal>
      <motion.div
        className="subtle-hover bg-transparent hover:bg-white/60 hover:backdrop-blur-sm hover:border-white/80 rounded-xl border border-white/20 p-8 transition-colors"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-medium text-primary-charcoal">
              {member.name}
            </h3>
            <p className="text-secondary-slate font-medium">
              {member.title}
            </p>
            <p className="text-text-muted text-sm leading-relaxed max-w-xs">
              {member.research}
            </p>
          </div>

          <div className="w-full">
            {member.link ? (
              <a
                href={member.link}
                target="_blank"
                rel="noopener noreferrer"
                className="elegant-button w-full justify-center"
              >
                个人主页
              </a>
            ) : (
              <Link
                href={`/team/${member.id}`}
                className="elegant-button w-full justify-center"
              >
                查看详情
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

// 学生列表组件 - 简约设计
function StudentList({ students, title }: { students: any, title: string }) {
  if (Array.isArray(students)) {
    // 博士研究生列表 — 多栏、透明
    return (
      <ScrollReveal>
        <motion.div
          className="p-4 h-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <h3 className="elegant-heading text-2xl">{title}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-sm text-primary-charcoal">
            {students.map((student: any, index: number) => (
              <div key={index} className="mb-4">
                <Link
                  href={`/team/${student.id}`}
                  className="block hover:text-accent-blue transition-colors"
                >
                  <p className="font-medium hover:underline">{student.name}</p>
                  <p className="text-text-muted text-sm">{student.research}{student.year ? `, ${student.year}` : ''}</p>
                </Link>
              </div>
            ))}
          </div>
        </motion.div>
      </ScrollReveal>
    );
  } else {
    // 硕士研究生按年级分组 — 年级分隔、多栏
    return (
      <ScrollReveal>
        <motion.div
          className="p-4 h-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <h3 className="elegant-heading text-2xl">{title}</h3>
          </div>

          <div className="space-y-10">
            {Object.entries(students).map(([year, studentList]) => (
              <div key={year}>
                <div className="text-center my-4">
                  <span className="text-secondary-slate">---{year}---</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm text-primary-charcoal">
                  {(studentList as any[]).map((student, idx) => (
                    <div key={idx} className="mb-3">
                      <Link
                        href={`/team/${student.id}`}
                        className="block hover:text-accent-blue transition-colors"
                      >
                        <p className="font-medium hover:underline">{student.name}</p>
                        <p className="text-text-muted text-sm">{student.research}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </ScrollReveal>
    );
  }
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-warm">
      {/* 页面标题 - 使用 Research 页面的设计 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-bold text-primary-charcoal mb-4 elegant-heading">
            <i className="bi bi-people mr-3 text-accent-blue"></i>实验室团队
          </h1>
          <p className="text-lg elegant-subheading max-w-3xl mx-auto">
            Team Members
          </p>
        </div>
      </div>

      {/* 教师团队 */}
      <div className="py-24 bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <motion.h2
              className="elegant-heading text-3xl md:text-4xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img src="/static/svg/teacher-svgrepo-com.svg" alt="教师" className="inline-block w-8 h-8 mr-3 mb-2" />
              教师团队 STAFFS
            </motion.h2>
            <div className="w-16 h-px bg-linear-to-r from-transparent via-secondary-slate to-transparent mx-auto"></div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facultyMembers.map((member, index) => (
              <FacultyCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </div>

      {/* 研究生团队 */}
      <div className="py-24 bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <motion.h2
              className="elegant-heading text-3xl md:text-4xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img src="/static/svg/backpack-svgrepo-com.svg" alt="研究生" className="inline-block w-8 h-8 mr-3 mb-2" />
              学生 STUDENTS
            </motion.h2>
            <div className="w-16 h-px bg-linear-to-r from-transparent via-secondary-slate to-transparent mx-auto"></div>
          </ScrollReveal>

          <div className="space-y-12">
            <ScrollReveal direction="left" className="h-full">
              <StudentList students={graduateStudents.phd} title="博士研究生" />
            </ScrollReveal>

            <div className="w-full h-px bg-linear-to-r from-transparent via-secondary-slate to-transparent" />

            <ScrollReveal direction="right" delay={0.2} className="h-full">
              <StudentList students={graduateStudents.masters} title="硕士研究生" />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
