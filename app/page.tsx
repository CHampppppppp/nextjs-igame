'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, HoverEffect } from "./components/layout/page-transition";

// 轮播组件
function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/images/main-slider/1.png",
      title: "欢迎来到 iGame Lab",
      subtitle: "智能可视化与仿真实验室",
      description: "专注于三维数字化建模、计算机视觉、工业软件开发等领域"
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
    <div className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 flex items-center justify-center h-full text-white">
            <div className="max-w-4xl px-6 text-center">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <motion.h1
                  className="elegant-heading text-5xl md:text-7xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {slide.title}
                </motion.h1>
                <motion.h2
                  className="elegant-subheading text-xl md:text-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {slide.subtitle}
                </motion.h2>
                <motion.p
                  className="elegant-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {slide.description}
                </motion.p>
                {slide.buttonText && slide.buttonLink && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <Link
                      href={slide.buttonLink}
                      className="accent-button"
                    >
                      {slide.buttonText}
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all z-20 border border-white/20"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all z-20 border border-white/20"
      >
        ›
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all border border-white/50 ${index === currentSlide ? 'bg-white' : 'bg-transparent'
              }`}
          />
        ))}
      </div>
    </div>
  );
}

// 实验室简介组件 - 简约设计
function LabIntro() {
  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="elegant-heading text-4xl md:text-5xl mb-6">实验室简介</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-secondary-slate to-transparent mx-auto mb-6"></div>
            <p className="elegant-subheading text-lg">introduction</p>
          </motion.div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <motion.div
            className="elegant-body text-lg leading-relaxed space-y-6 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p>
              智能可视建模与仿真实验室 (Intelligent Visual Modeling & Simulation Lab, iGame)，
              隶属于<span className="font-medium">杭州电子科技大学计算机学院图形图像所</span>，负责人为<span className="font-medium">徐岗</span>教授。
            </p>
            <p>
              团队现在拥有教师6名（其中教授1名，副教授3名，讲师2名），博士研究生3名，硕士研究生40多名。
              团队主要研究方向包括计算机辅助设计与仿真、等几何分析、计算机视觉、机器学习等。
            </p>
            <p>
              已在相关领域的国内外主流期刊/会议上发表学术论文80余篇，其中在CMAME、CAD、CAGD、Computers & Structures 、IEEE TCYB、IEEE TIP等国际权威SCI期刊发表论文30余篇，
              多篇论文入选ESI热点论文和高被引论文。团队成员以负责人身份主持承担或完成多项国家自然科学基金项目（包括1项中德合作重点项目）。
              并与多名国内外知名学者、出色研究小组保持着广泛和深入的学术交流与合作。
            </p>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// 近期论文组件 - 简约设计
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
    <section className="py-24 bg-warm">
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <motion.h2
            className="elegant-heading text-4xl md:text-5xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            近期论文
          </motion.h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-secondary-slate to-transparent mx-auto mb-6"></div>
          <p className="elegant-subheading text-lg">Recent Publications</p>
        </ScrollReveal>

        <div className="space-y-12">
          {papers.map((paper, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                className="subtle-hover p-8 bg-white/60 backdrop-blur-sm rounded-xl border border-white/80"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-medium mb-4 leading-tight text-primary-charcoal">
                  {paper.title}
                </h3>
                <p className="text-secondary-slate mb-3 italic text-sm">
                  {paper.authors}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-secondary-slate font-medium">
                    {paper.journal}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-text-muted text-sm">
                      {paper.year}
                    </span>
                    {paper.impact && (
                      <span className="px-3 py-1 bg-accent-gold/10 text-accent-gold text-xs font-medium rounded-full">
                        {paper.impact}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// 最新信息组件 - 简约设计
function LatestNews() {
  const news = [
    { title: "实验室获得国家自然科学基金面上项目资助", date: "2024-01-15" },
    { title: "新增4名博士研究生加入实验室", date: "2024-01-10" },
    { title: "实验室论文在顶级期刊发表", date: "2024-01-05" },
    { title: "与企业合作项目启动", date: "2023-12-28" }
  ];

  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <motion.h2
            className="elegant-heading text-3xl md:text-4xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            最新信息
          </motion.h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-secondary-slate to-transparent mx-auto"></div>
        </ScrollReveal>

        <div className="space-y-8">
          {news.map((item, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                className="flex justify-between items-start py-6 border-b border-text-muted/20 last:border-b-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-medium text-primary-charcoal leading-relaxed">
                  {item.title}
                </h3>
                <span className="text-text-muted text-sm whitespace-nowrap ml-6">
                  {item.date}
                </span>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// 欢迎加入我们组件 - 简约设计
function JoinUs() {
  return (
    <section className="py-24 bg-primary-charcoal text-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <ScrollReveal>
          <motion.h2
            className="elegant-heading text-3xl md:text-4xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            欢迎加入我们
          </motion.h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <motion.p
            className="elegant-body text-lg mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            我们正在寻找优秀的本科生、研究生和博士生加入我们的团队，
            共同探索前沿技术，开展创新性研究。
          </motion.p>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              href="/contact"
              className="elegant-button bg-white text-primary-charcoal border-white hover:bg-transparent hover:text-white inline-block"
            >
              联系我们
            </Link>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// 团队建设组件 - 横向滚动设计
function TeamBuilding() {
  const activities = [
    {
      title: "2019绍兴团建",
      date: "2019-09",
      image: "/images/resource/news-1.jpg"
    },
    {
      title: "2020年会",
      date: "2020-10",
      image: "/images/resource/news-2.jpg"
    },
    {
      title: "2020中秋聚餐",
      date: "2020-11",
      image: "/images/resource/news-3.jpg"
    },
    {
      title: "2020暑期团建",
      date: "2020-07",
      image: "/images/resource/news-4.jpg"
    },
    {
      title: "华为软件精英挑战赛",
      date: "2024-11",
      image: "/images/resource/news-huawei.jpg"
    },
    {
      title: "学术报告",
      date: "2024-01",
      image: "/images/resource/news-5.jpg"
    }
  ];

  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollSpeed = 2; // 滚动速度
  const pauseDuration = 2000; // 鼠标悬停时的暂停时间（毫秒）

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          scrollContainer.scrollLeft += scrollSpeed;
          // 当滚动到末尾时，回到开始位置
          if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
            scrollContainer.scrollLeft = 0;
          }
        }
      }, 30);
    };

    startAutoScroll();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsPaused(false);
    }, pauseDuration);
  };

  return (
    <section className="py-24 bg-warm">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <motion.h2
            className="elegant-heading text-3xl md:text-4xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            团队建设
          </motion.h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-secondary-slate to-transparent mx-auto mb-8"></div>
          <p className="elegant-subheading text-lg">Team Building</p>
        </ScrollReveal>

        <div
          ref={scrollRef}
          className="overflow-x-auto pb-4 scrollbar-hide"
          style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE and Edge
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="flex space-x-6 min-w-max px-2">
            {activities.map((activity, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <motion.div
                  className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="relative h-48">
                    <Image
                      src={activity.image}
                      alt={activity.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-primary-charcoal mb-2 leading-tight">
                      {activity.title}
                    </h3>
                    <div className="flex items-center text-text-muted text-sm">
                      <span>{activity.date}</span>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
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
