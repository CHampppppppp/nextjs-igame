'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, HoverEffect } from "./components/layout/page-transition";

// 轮播组件
function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollOpacity, setScrollOpacity] = useState(1);

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
    },
    {
      image: "/images/main-slider/3.png",
      title: "科研成果",
      subtitle: "前沿学术研究",
      description: "在计算机辅助设计、等几何分析、机器学习等领域取得重要突破"
    },
    {
      image: "/images/main-slider/4.png",
      title: "人才培养",
      subtitle: "优秀的团队成员",
      description: "培养博士研究生和硕士研究生多名，学生在各类竞赛中屡获佳绩"
    },
    {
      image: "/images/main-slider/5.png",
      title: "学术交流",
      subtitle: "广泛的合作网络",
      description: "与国内外知名学者和研究机构保持深入学术交流与合作"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // 监听滚动事件，实现图片随滚动逐渐透明的效果
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // 当滚动距离超过视窗高度的50%时开始透明化
      // 滚动到视窗高度时完全透明
      const fadeStart = windowHeight * 0.5;
      const fadeEnd = windowHeight;

      if (scrollY <= fadeStart) {
        setScrollOpacity(1);
      } else if (scrollY >= fadeEnd) {
        setScrollOpacity(0);
      } else {
        // 线性插值计算透明度
        const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
        setScrollOpacity(1 - progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          style={{ opacity: index === currentSlide ? scrollOpacity : 0 }}
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
                  className="text-white text-xl md:text-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {slide.subtitle}
                </motion.h2>
                <motion.p
                  className="text-white text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
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
        className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white w-12 h-12 rounded-full flex justify-center transition-all z-20 border border-white/20 cursor-pointer text-3xl "
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white w-12 h-12 rounded-full flex justify-center transition-all z-20 border border-white/20 cursor-pointer text-3xl"
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

// 实验室简介组件 - 匹配旧HTML布局
function LabIntro() {
  return (
    <section className="about-style-three p-24 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧标题列 */}
          <div className="lg:col-span-5 title-column">
            <ScrollReveal>
              <motion.div
                className="title-box"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="sec-title elegant-heading text-3xl md:text-4xl mb-4">实验室简介</h2>
                <p className="title-text elegant-subheading text-lg text-secondary-slate">introduction</p>
              </motion.div>
            </ScrollReveal>
          </div>

          {/* 右侧内容列 */}
          <div className="lg:col-span-7 content-column">
            <ScrollReveal delay={0.2}>
              <motion.div
                className="content-box elegant-body text-lg leading-relaxed space-y-6"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <p className="top-text">
                  智能可视建模与仿真实验室 (Intelligent Visual Modeling & Simulation Lab, iGame)，隶属于<b>杭州电子科技大学计算机学院图形图像所</b>，负责人为<b>徐岗</b>教授。
                </p>
                <p className="text">
                  团队现在拥有教师6名（其中教授1名，副教授3名，讲师2名），博士研究生3名，硕士研究生40多名。团队主要研究方向包括计算机辅助设计与仿真、等几何分析、计算机视觉、机器学习等。
                </p>
                <p className="text">
                  已在相关领域的国内外主流期刊/会议上发表学术论文80余篇，其中在CMAME、CAD、CAGD、Computers & Structures 、IEEE TCYB、IEEE TIP等国际权威SCI期刊发表论文30余篇，多篇论文入选ESI 热点论文和高被引论文。团队成员以负责人身份主持承担或完成多项国家自然科学基金项目（包括1项中德合作重点项目）。并与多名国内外知名学者、出色研究小组保持着广泛和深入的学术交流与合作。
                </p>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// 近期论文和最新信息合并组件 - 匹配旧HTML结构
function EventSection() {
  const papers = [
    {
      title: "IGA-suitable planar parameterization with patch structure simplification of closed-form polysquare",
      authors: "S Wang, J Ren, X Fang, H Lin, G Xu, H Bao, J Huang",
      journal: "Computer Methods in Applied Mechanics and Engineering, 2022, 392: 114678",
      impact: "TOP期刊"
    },
    {
      title: "LASOR: Learning Accurate 3D Human Pose and Shape Via Synthetic Occlusion-Aware Data and Neural Mesh Rendering",
      authors: "K Yang, R Gu, M Wang, M Toyoura*, G Xu*",
      journal: "IEEE Transactions on Image Processing, 2022,31, 1938 - 1948",
      impact: "TOP期刊"
    },
    {
      title: "Construction of IGA-suitable Volume Parametric Models by the Segmentation-Mapping-Merging Mechanism of Design Features",
      authors: "L Chen, N Bu, Y Jin, G Xu*, B Li",
      journal: "Computer-Aided Design, 2022: 103228",
      impact: "CCF B"
    }
  ];

  const news = [
    { title: "实验室一篇论文被顶刊TIP录用", date: "25 Feb, 2022" },
    { title: "与之江实验室合作研发的\"面向深度学习的交互可视化与可视分析\"平台开源上线", date: "02 Nov, 2021" },
    { title: "欢迎顾人舒博士加入iGame实验室！", date: "10 Dec, 2021" },
    { title: "获批一项国家自然科学基金-浙江两化融合联合基金重点项目", date: "12 Nov, 2020" }
  ];

  return (
    <section className="event-section p-24 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 近期论文 - 左侧8列 */}
          <div className="lg:col-span-8">
            <div className="event-content">
              <div className="flex items-center mb-8">
                <i className="bi bi-files text-2xl mr-3 text-primary-charcoal"></i>
                <h2 className="elegant-heading text-2xl md:text-3xl">近期论文</h2>
              </div>

              <div className="space-y-8">
                {papers.map((paper, index) => (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <motion.div
                      className="single-item p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/80 shadow-sm"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <h3 className="text-xl font-medium mb-3 leading-tight text-primary-charcoal">
                        {paper.title}
                      </h3>
                      <p className="text-secondary-slate mb-2 italic text-sm">
                        {paper.authors}
                      </p>
                      <p className="text-secondary-slate text-sm">
                        <i>{paper.journal}</i>
                      </p>
                      {paper.impact && (
                        <div className="mt-2">
                          <span className="px-3 py-1 bg-accent-gold/10 text-accent-gold text-xs font-medium rounded-full">
                            {paper.impact}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>

          {/* 最新信息 - 右侧4列 */}
          <div className="lg:col-span-4">
            <div className="latest-event">
              <div className="flex items-center mb-8">
                <i className="bi bi-calendar-check text-2xl mr-3 text-primary-charcoal"></i>
                <h2 className="elegant-heading text-2xl md:text-3xl">最新信息</h2>
              </div>

              <div className="space-y-6">
                {news.map((item, index) => (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <motion.div
                      className="single-item p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/80 shadow-sm"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-base font-medium text-primary-charcoal leading-relaxed flex-1">
                          {item.title}
                        </h4>
                        <span className="text-text-muted text-sm whitespace-nowrap flex-shrink-0">
                          <i className="bi bi-calendar2-minus-fill mr-1"></i>
                          {item.date}
                        </span>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 欢迎加入我们组件 - 匹配旧HTML设计
function JoinUs() {
  return (
    <section className="cta-section py-24 bg-black text-white relative overflow-hidden">
      {/* 背景图片 */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: "url('/images/background/bg.png')" }}
      ></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <ScrollReveal>
          <motion.div
            className="content-box"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="cta-title elegant-heading text-3xl md:text-4xl mb-8">欢迎加入我们</h2>

            <motion.p
              className="text text-white text-lg mb-12 leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              团队每年招收博士研究生1名，硕士研究生15名左右，欢迎感兴趣的同学与我们联系！！
            </motion.p>

            <motion.div
              className="link"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                href="/contact"
                className="theme-btn slide-btn-one bg-white text-black px-8 py-3 rounded hover:bg-gray-100 transition-colors inline-block font-medium"
              >
                联系我们
              </Link>
            </motion.div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// 团队建设组件 - 匹配旧HTML设计
function TeamBuilding() {
  const activities = [
    {
      title: "2019绍兴团建",
      date: "on 2 Sep, 2018",
      image: "/images/resource/news-1.jpg"
    },
    {
      title: "2020年会",
      date: "on 20 Oct, 2020",
      image: "/images/resource/news-2.jpg"
    },
    {
      title: "2020中秋聚餐",
      date: "on 25 Nov, 2020",
      image: "/images/resource/news-3.jpg"
    },
    {
      title: "2020暑期团建",
      date: "on 25 Nov, 2020",
      image: "/images/resource/news-4.jpg"
    },
    {
      title: "2024年华为软件精英挑战赛",
      date: "on 25 Nov, 2025",
      image: "/images/resource/news-huawei.jpg"
    }
  ];

  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const scrollSpeed = 1.5; // 滚动速度（像素/帧）
  const pauseDuration = 2000; // 鼠标悬停时的暂停时间（毫秒）

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const animate = (currentTime: number = 0) => {
      if (!animationRef.current) return;

      const deltaTime = currentTime - lastTimeRef.current;

      // 控制帧率，大约60FPS
      if (deltaTime >= 16.67) {
        if (!isPaused) {
          // 平滑滚动，使用更小的增量
          scrollContainer.scrollLeft += scrollSpeed;

          // 当滚动到末尾时，平滑回到开始位置
          if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth - 10) {
            scrollContainer.scrollLeft = 0;
          }
        }
        lastTimeRef.current = currentTime;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const startAutoScroll = () => {
      if (!animationRef.current) {
        lastTimeRef.current = performance.now();
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const stopAutoScroll = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    startAutoScroll();

    return () => {
      stopAutoScroll();
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
    <section className="news-section py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <motion.div
            className="title-box"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="sec-title elegant-heading text-3xl md:text-4xl mb-4">团队建设</h2>
            <p className="title-text elegant-subheading text-lg text-secondary-slate">Team Building</p>
          </motion.div>
        </ScrollReveal>

        <div className="news-content">
          <div
            ref={scrollRef}
            className="three-column-carousel overflow-x-auto pb-4 scrollbar-hide"
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
                    className="single-news-content flex-shrink-0 w-80 bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
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
                    <figure className="image-box relative h-48">
                      <Image
                        src={activity.image}
                        alt={activity.title}
                        fill
                        className="object-cover"
                      />
                    </figure>
                    <div className="content-box p-6" style={{ opacity: 0.6 }}>
                      <h5 className="text-lg font-medium text-primary-charcoal mb-2 leading-tight">
                        {activity.title}
                      </h5>
                      <ul className="info-content">
                        <li className="text-text-muted text-sm">{activity.date}</li>
                      </ul>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
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
      <EventSection />
      <JoinUs />
      <TeamBuilding />
    </div>
  );
}
