'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollAnimationOptions {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

export const useScrollAnimation = (
  animation: (element: Element) => gsap.core.Timeline | gsap.core.Tween,
  options: ScrollAnimationOptions = {}
) => {
  const elementRef = useRef<Element>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const trigger = options.trigger || element;
    const scrollTriggerConfig = {
      trigger,
      start: options.start || 'top 80%',
      end: options.end || 'bottom 20%',
      scrub: options.scrub ?? false,
      pin: options.pin ?? false,
      markers: options.markers ?? false,
      onEnter: options.onEnter,
      onLeave: options.onLeave,
      onEnterBack: options.onEnterBack,
      onLeaveBack: options.onLeaveBack,
    };

    const tl = animation(element);
    tl.scrollTrigger = ScrollTrigger.create({
      ...scrollTriggerConfig,
      animation: tl,
    });

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, [animation, options]);

  return elementRef;
};

// 预设滚动动画
export const scrollAnimationPresets = {
  // 淡入上升
  fadeInUp: (element: Element) => {
    return gsap.fromTo(element,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    );
  },

  // 从左侧滑入
  slideInLeft: (element: Element) => {
    return gsap.fromTo(element,
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }
    );
  },

  // 从右侧滑入
  slideInRight: (element: Element) => {
    return gsap.fromTo(element,
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }
    );
  },

  // 缩放进入
  scaleIn: (element: Element) => {
    return gsap.fromTo(element,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
    );
  },

  // 旋转进入
  rotateIn: (element: Element) => {
    return gsap.fromTo(element,
      { opacity: 0, rotation: -180, scale: 0 },
      { opacity: 1, rotation: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' }
    );
  },

  // 视差滚动
  parallax: (element: Element, speed: number = 0.5) => {
    return gsap.fromTo(element,
      { y: 0 },
      {
        y: `-${speed * 100}%`,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  },

  // 文字逐字出现
  textReveal: (element: Element) => {
    const text = element.textContent || '';
    element.textContent = '';

    const chars = text.split('');
    const tl = gsap.timeline();

    chars.forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      element.appendChild(span);

      tl.to(span, {
        opacity: 1,
        duration: 0.05,
        ease: 'power2.out'
      }, index * 0.05);
    });

    return tl;
  },

  // 计数器动画
  counter: (element: Element, targetValue: number) => {
    const startValue = { value: 0 };

    return gsap.to(startValue, {
      value: targetValue,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = Math.floor(startValue.value).toString();
      }
    });
  }
};

// 交错动画钩子
export const useStaggerAnimation = (
  elements: Element[],
  animation: (element: Element) => gsap.core.Timeline | gsap.core.Tween,
  stagger: number = 0.1
) => {
  useEffect(() => {
    if (!elements.length) return;

    const tl = gsap.timeline();
    elements.forEach((element, index) => {
      tl.add(animation(element), index * stagger);
    });

    ScrollTrigger.create({
      trigger: elements[0],
      start: 'top 80%',
      animation: tl
    });

    return () => {
      tl.kill();
    };
  }, [elements, animation, stagger]);
};

// 滚动进度钩子
export const useScrollProgress = () => {
  const progressRef = useRef<number>(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      progressRef.current = Math.min(scrollPercent, 1);
    };

    const handleScroll = () => {
      requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', handleScroll);
    updateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return progressRef.current;
};

export default useScrollAnimation;
