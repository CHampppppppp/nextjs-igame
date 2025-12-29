import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// 注册GSAP插件
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

// 动画预设
export const animationPresets = {
  // 淡入动画
  fadeIn: {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power2.out'
  },

  // 缩放动画
  scaleIn: {
    scale: 0,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.7)'
  },

  // 滑动动画
  slideIn: {
    x: -50,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.out'
  },

  // 旋转动画
  rotateIn: {
    rotation: -180,
    scale: 0,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.7)'
  },

  // 弹跳动画
  bounceIn: {
    y: 100,
    opacity: 0,
    duration: 0.8,
    ease: 'bounce.out'
  }
};

// 滚动触发动画
export const scrollAnimations = {
  // 元素进入视口时触发动画
  animateOnScroll: (element: Element, animation: any) => {
    gsap.from(element, {
      ...animation,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });
  },

  // 视差滚动效果
  parallaxScroll: (element: Element, speed: number = 0.5) => {
    gsap.to(element, {
      y: `-${speed * 100}%`,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  },

  // 旋转跟随滚动
  rotateOnScroll: (element: Element, rotation: number = 360) => {
    gsap.to(element, {
      rotation: rotation,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }
};

// 交互动画
export const interactionAnimations = {
  // 悬停放大效果
  hoverScale: (element: Element) => {
    const tl = gsap.timeline({ paused: true });
    tl.to(element, { scale: 1.05, duration: 0.3, ease: 'power2.out' });

    element.addEventListener('mouseenter', () => tl.play());
    element.addEventListener('mouseleave', () => tl.reverse());
  },

  // 磁性效果（鼠标跟随）
  magneticEffect: (element: Element, strength: number = 0.3) => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      gsap.to(element, {
        x: deltaX * strength,
        y: deltaY * strength,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }
};

// 页面过渡动画
export const pageTransitions = {
  // 页面进入动画
  pageEnter: (container: Element) => {
    const tl = gsap.timeline();
    tl.from(container, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out'
    });
    return tl;
  },

  // 页面离开动画
  pageLeave: (container: Element) => {
    const tl = gsap.timeline();
    tl.to(container, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in'
    });
    return tl;
  }
};

// 3D 变换动画
export const threeDAnimations = {
  // 3D 旋转效果
  rotate3D: (element: Element, duration: number = 2) => {
    gsap.to(element, {
      rotationY: 360,
      duration: duration,
      ease: 'none',
      repeat: -1
    });
  },

  // 3D 悬浮效果
  float3D: (element: Element, intensity: number = 20) => {
    gsap.to(element, {
      y: `-${intensity}px`,
      duration: 2,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1
    });
  }
};

// 文字动画
export const textAnimations = {
  // 打字机效果
  typeWriter: (element: Element, text: string, speed: number = 100) => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return timer;
  },

  // 文字渐显效果
  textReveal: (element: Element) => {
    const text = element.textContent || '';
    element.textContent = '';
    element.style.opacity = '1';

    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.textContent = text[i];
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      element.appendChild(span);

      gsap.to(span, {
        opacity: 1,
        delay: i * 0.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }
};

// 加载动画
export const loadingAnimations = {
  // 脉冲加载
  pulseLoader: (element: Element) => {
    gsap.to(element, {
      scale: 1.2,
      opacity: 0.7,
      duration: 0.8,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1
    });
  },

  // 旋转加载
  spinLoader: (element: Element) => {
    gsap.to(element, {
      rotation: 360,
      duration: 1,
      ease: 'none',
      repeat: -1
    });
  }
};

export default {
  animationPresets,
  scrollAnimations,
  interactionAnimations,
  pageTransitions,
  threeDAnimations,
  textAnimations,
  loadingAnimations
};
