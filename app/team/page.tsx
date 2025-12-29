'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, HoverEffect } from "../../components/layout/page-transition";
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

// 研究生数据（按年级分组）
const graduateStudents = {
  phd: [
    { name: "高健 Gao Jian", year: "2024级博士", research: "博士研究生" },
    { name: "车俊俊 Che Junjun", year: "2024级博士", research: "博士研究生" },
    { name: "胡泽楷 Hu Zekai", year: "2025级博士", research: "博士研究生" },
    { name: "高红依 Gao Hongyi", year: "2025级博士", research: "博士研究生" }
  ],
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

// 教师卡片组件 - 科技感设计
function FacultyCard({ member }: { member: typeof facultyMembers[0] }) {
  return (
    <div className="tech-card group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
      {/* 悬停时的背景渐变效果 */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="aspect-square relative overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* 图片覆盖层 */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="relative p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
          {member.name}
        </h3>
        <p className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-600 font-semibold mb-3">
          {member.title}
        </p>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {member.research}
        </p>

        <div className="flex space-x-3">
          {member.link ? (
            <a
              href={member.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center bg-linear-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i className="bi bi-link-45deg mr-2"></i>
              个人主页
            </a>
          ) : (
            <Link
              href={`/team/${member.id}`}
              className="flex-1 inline-flex items-center justify-center bg-linear-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i className="bi bi-eye mr-2"></i>
              查看详情
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// 学生列表组件 - 科技感设计
function StudentList({ students, title }: { students: any, title: string }) {
  if (Array.isArray(students)) {
    // 博士研究生列表
    return (
      <div className="tech-card bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
            <i className="bi bi-mortarboard-fill text-white text-xl"></i>
          </div>
          <h3 className="text-2xl font-bold gradient-text">{title}</h3>
        </div>
        <div className="space-y-4">
          {students.map((student: any, index: number) => (
            <div key={index} className="group flex items-center justify-between py-4 px-4 rounded-xl hover:bg-linear-to-r hover:from-blue-50 hover:to-blue-50 transition-all duration-300 border border-transparent hover:border-blue-100">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.research}</p>
                </div>
              </div>
              <span className="text-sm font-medium text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                {student.year}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    // 硕士研究生按年级分组
    return (
      <div className="tech-card bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-linear-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
            <i className="bi bi-people-fill text-white text-xl"></i>
          </div>
          <h3 className="text-2xl font-bold gradient-text">{title}</h3>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-6 scrollbar-hide">
          {Object.entries(students).map(([year, studentList], yearIndex) => (
            <div key={year} className="relative">
              {/* 年级分隔线 */}
              <div className="flex items-center mb-4">
                <div className="flex-1 h-px bg-linear-to-r from-transparent via-blue-200 to-transparent"></div>
                <h4 className="text-lg font-bold text-gray-800 mx-4 px-4 py-2 bg-linear-to-r from-blue-50 to-blue-50 rounded-full border border-blue-100">
                  <span className="gradient-text">{year}</span> 硕士研究生
                </h4>
                <div className="flex-1 h-px bg-linear-to-r from-transparent via-blue-200 to-transparent"></div>
              </div>

              <div className="space-y-3 pl-4">
                {(studentList as any[]).map((student, index) => (
                  <div key={index} className="group flex items-center justify-between py-3 px-4 rounded-xl hover:bg-linear-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-300 border border-transparent hover:border-green-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-linear-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-semibold text-xs">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-green-900 transition-colors">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.research}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-transparent bg-clip-text bg-linear-to-r from-green-600 to-blue-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                      {year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default function TeamPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)' }}>
      {/* 页面标题 - 科技感设计 */}
      <div className="relative overflow-hidden">
        {/* 背景装饰元素 */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-indigo-50 to-blue-50 opacity-50"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-full mb-6 shadow-lg">
                <i className="bi bi-person-badge text-3xl text-white"></i>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
                团队成员
              </h1>
              <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
            </div>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              我们拥有优秀的教师团队和充满活力的研究生群体，共同致力于前沿技术研究和人才培养。
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* 教师团队 */}
        <section className="mb-24">
          <ScrollReveal className="text-center mb-16">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <i className="bi bi-person-badge-fill text-2xl text-white"></i>
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl font-bold gradient-text mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              教师团队
            </motion.h2>
            <motion.div
              className="w-32 h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-blue-600 mx-auto rounded-full mb-6"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.p
              className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              汇聚多位资深教授和青年教师，拥有丰富的教学经验和卓越的科研成果
            </motion.p>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {facultyMembers.map((member, index) => (
              <HoverEffect key={member.id}>
                <FacultyCard member={member} />
              </HoverEffect>
            ))}
          </StaggerContainer>
        </section>

        {/* 学生团队 */}
        <section>
          <ScrollReveal className="text-center mb-16">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-green-500 to-teal-600 rounded-2xl mb-6 shadow-lg"
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <i className="bi bi-people-fill text-2xl text-white"></i>
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl font-bold gradient-text mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              学生团队
            </motion.h2>
            <motion.div
              className="w-32 h-1 bg-linear-to-r from-green-500 via-teal-500 to-blue-600 mx-auto rounded-full mb-6"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.p
              className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {graduateStudents.phd.length}名博士研究生和{Object.values(graduateStudents.masters).flat().length}名硕士研究生组成的学术梯队
            </motion.p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ScrollReveal direction="left">
              <StudentList students={graduateStudents.phd} title="博士研究生" />
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2}>
              <StudentList students={graduateStudents.masters} title="硕士研究生" />
            </ScrollReveal>
          </div>
        </section>
      </div>
    </div>
  );
}
