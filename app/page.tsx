'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, HoverEffect } from "../components/layout/page-transition";

// 轮播组件
function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/images/main-slider/1.png",
      title: "欢迎来到 iGame Lab",
      subtitle: "智能可视化与仿真实验室",
      description: "专注于三维数字化建模、计算机视觉、工业软件开发等领域",
      buttonText: "了解更多",
      buttonLink: "#about"
    },
    {
      image: "/images/main-slider/2.png",
      title: "教师团队",
      subtitle: "优秀的导师团队",
      description: "汇聚多位资深教授和青年教师，致力于学术研究和人才培养",
      buttonText: "查看团队",
      buttonLink: "/team"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-96 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 flex items-center justify-center h-full text-white text-center px-4">
            <motion.div
              className="max-w-4xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-4 gradient-text"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {slide.title}
              </motion.h1>
              <motion.h2
                className="text-xl md:text-2xl mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {slide.subtitle}
              </motion.h2>
              <motion.p
                className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {slide.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <Link
                  href={slide.buttonLink}
                  className="inline-block bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {slide.buttonText}
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all z-20"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all z-20"
      >
        ›
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
          />
        ))}
      </div>
    </div>
  );
}

// 实验室简介组件
function LabIntro() {
  return (
    <section className="about-style-three py-20 bg-linear-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left">
            <div className="title-column">
              <motion.div
                className="sec-title mb-6"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">实验室简介</h2>
                <div className="w-20 h-1 bg-linear-to-r from-blue-500 to-blue-600 rounded-full mb-4"></div>
                <div className="title-text text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-600 font-semibold text-lg">
                  introduction
                </div>
              </motion.div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <div className="content-column">
              <HoverEffect>
                <motion.div
                  className="content-box glass-effect p-8 rounded-2xl shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="top-text text-gray-700 mb-6 leading-relaxed text-lg">
                    智能可视建模与仿真实验室 (Intelligent Visual Modeling & Simulation Lab, iGame)，
                    隶属于<b className="text-blue-600">杭州电子科技大学计算机学院图形图像所</b>，负责人为<b className="text-blue-600">徐岗</b>教授。
                  </div>
                  <div className="text text-gray-600 leading-relaxed">
                    团队现在拥有教师6名（其中教授1名，副教授3名，讲师2名），博士研究生3名，硕士研究生40多名。
                    团队主要研究方向包括计算机辅助设计与仿真、等几何分析、计算机视觉、机器学习等。
                    已在相关领域的国内外主流期刊/会议上发表学术论文80余篇，其中在CMAME、CAD、CAGD、Computers & Structures 、IEEE TCYB、IEEE TIP等国际权威SCI期刊发表论文30余篇，
                    多篇论文入选ESI热点论文和高被引论文。团队成员以负责人身份主持承担或完成多项国家自然科学基金项目（包括1项中德合作重点项目）。
                    并与多名国内外知名学者、出色研究小组保持着广泛和深入的学术交流与合作。
                  </div>
                </motion.div>
              </HoverEffect>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

// 近期论文组件
function RecentPapers() {
  const papers = [
    {
      title: "Singularity structure simplification of hexahedral mesh via weighted ranking",
      authors: "Gang Xu*, Ran Ling, Yongjie Jessica Zhang, Zhoufang Xiao, Zhongping Ji, Timon Rabczuk",
      journal: "Computer-Aided Design",
      year: "2021",
      impact: "CCF B"
    },
    {
      title: "IGA-suitable planar parameterization with patch structure simplification of closed-form polysquare",
      authors: "S Wang, J Ren, X Fang, H Lin, G Xu, H Bao, J Huang",
      journal: "Computer Methods in Applied Mechanics and Engineering",
      year: "2022",
      impact: "TOP期刊"
    },
    {
      title: "Complementary, Heterogeneous and Adversarial Networks for Image-to-Image Translation",
      authors: "Fei Gao, Xingxin Xu, Jun Yu, Meimei Shang, Xiang Li, and Dacheng Tao",
      journal: "IEEE Transactions on Image Processing",
      year: "2021",
      impact: "TOP期刊"
    }
  ];

  return (
    <section className="event-section event-style-two py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold gradient-text mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            近期论文
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-linear-to-r from-green-500 to-blue-600 mx-auto rounded-full mb-4"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Recent Publications
          </motion.p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {papers.map((paper, index) => (
            <HoverEffect key={index}>
              <motion.div
                className="bg-linear-to-br from-gray-50 to-blue-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50"
                whileHover={{
                  y: -8,
                  transition: { type: 'spring', stiffness: 300, damping: 20 }
                }}
              >
                <div className="content-box">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 leading-tight hover:text-blue-900 transition-colors">
                    {paper.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 italic">{paper.authors}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-600 font-semibold">
                      {paper.journal}
                    </span>
                    <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
                      {paper.year}
                    </span>
                  </div>
                  {paper.impact && (
                    <motion.span
                      className="inline-block px-4 py-2 bg-linear-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-md"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {paper.impact}
                    </motion.span>
                  )}
                </div>
              </motion.div>
            </HoverEffect>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// 最新信息组件
function LatestNews() {
  const news = [
    { title: "实验室获得国家自然科学基金面上项目资助", date: "2024-01-15" },
    { title: "新增4名博士研究生加入实验室", date: "2024-01-10" },
    { title: "实验室论文在顶级期刊发表", date: "2024-01-05" },
    { title: "与企业合作项目启动", date: "2023-12-28" }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">最新信息</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{item.title}</h3>
                <span className="text-sm text-gray-500">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 欢迎加入我们组件
function JoinUs() {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">欢迎加入我们</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          我们正在寻找优秀的本科生、研究生和博士生加入我们的团队，
          共同探索前沿技术，开展创新性研究。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            联系我们
          </Link>
        </div>
      </div>
    </section>
  );
}

// 团队建设组件
function TeamBuilding() {
  const activities = [
    { title: "学术报告", date: "2024-01", image: "/images/resource/event-1.png" },
    { title: "年会报告", date: "2023-12", image: "/images/resource/event-2.png" },
    { title: "新生聚餐", date: "2023-09", image: "/images/resource/news-1.jpg" },
    { title: "日租房团建", date: "2023-11", image: "/images/resource/news-2.jpg" },
    { title: "19年会报告", date: "2023-10", image: "/images/resource/news-3.jpg" },
    { title: "绍兴团建大禹陵合影", date: "2023-05", image: "/images/resource/news-4.jpg" }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">团队建设</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <div key={index} className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
              <div className="relative h-48">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                <p className="text-sm text-gray-600">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <Carousel />
      <LabIntro />
      <RecentPapers />
      <LatestNews />
      <JoinUs />
      <TeamBuilding />
    </div>
  );
}
