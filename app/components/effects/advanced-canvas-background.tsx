'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
  pulse: number;
}

interface WavePoint {
  x: number;
  y: number;
  baseY: number;
  amplitude: number;
  frequency: number;
  phase: number;
}

export default function AdvancedCanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const nodesRef = useRef<Node[]>([]);
  const wavesRef = useRef<WavePoint[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });
  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  // 优雅的色彩渐变
  const colorPalette = [
    'rgba(212, 175, 55, 0.8)',  // 金色
    'rgba(100, 116, 139, 0.6)', // 石板灰
    'rgba(245, 158, 11, 0.7)',  // 琥珀色
    'rgba(26, 26, 26, 0.9)',    // 深炭色
    'rgba(148, 163, 184, 0.5)', // 柔和灰
  ];

  // 初始化粒子系统
  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const particles: Particle[] = [];

    // 根据设备性能和屏幕尺寸动态调整粒子数量
    const baseCount = Math.floor((canvas.width * canvas.height) / 15000);
    const performanceMultiplier = navigator.hardwareConcurrency ? Math.min(navigator.hardwareConcurrency / 4, 1) : 0.5;
    const particleCount = Math.max(30, Math.min(150, Math.floor(baseCount * performanceMultiplier)));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 1,
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        opacity: Math.random() * 0.8 + 0.2,
        life: 0,
        maxLife: Math.random() * 400 + 150,
      });
    }

    particlesRef.current = particles;
  }, [colorPalette]);

  // 初始化节点网络
  const initNodes = useCallback((canvas: HTMLCanvasElement) => {
    const nodes: Node[] = [];

    // 根据设备性能动态调整节点数量
    const baseCount = Math.floor((canvas.width * canvas.height) / 40000);
    const performanceMultiplier = navigator.hardwareConcurrency ? Math.min(navigator.hardwareConcurrency / 4, 1) : 0.5;
    const nodeCount = Math.max(8, Math.min(35, Math.floor(baseCount * performanceMultiplier)));

    for (let i = 0; i < nodeCount; i++) {
      const node: Node = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        connections: [],
        pulse: Math.random() * Math.PI * 2,
      };

      // 找到最近的几个节点进行连接
      const maxConnections = 3;
      const maxDistance = Math.min(canvas.width, canvas.height) * 0.15;

      for (let j = 0; j < nodes.length && node.connections.length < maxConnections; j++) {
        const distance = Math.sqrt(
          Math.pow(node.x - nodes[j].x, 2) + Math.pow(node.y - nodes[j].y, 2)
        );

        if (distance < maxDistance) {
          node.connections.push(j);
          nodes[j].connections.push(i);
        }
      }

      nodes.push(node);
    }

    nodesRef.current = nodes;
  }, []);

  // 初始化波浪效果
  const initWaves = useCallback((canvas: HTMLCanvasElement) => {
    const waves: WavePoint[] = [];
    const waveCount = 8;

    for (let i = 0; i < waveCount; i++) {
      const points: WavePoint[] = [];
      const pointCount = Math.floor(canvas.width / 20);

      for (let j = 0; j <= pointCount; j++) {
        points.push({
          x: (j / pointCount) * canvas.width,
          y: canvas.height * (0.3 + i * 0.1),
          baseY: canvas.height * (0.3 + i * 0.1),
          amplitude: 20 + Math.random() * 30,
          frequency: 0.002 + Math.random() * 0.003,
          phase: Math.random() * Math.PI * 2,
        });
      }

      waves.push(...points);
    }

    wavesRef.current = waves;
  }, []);

  // 动画循环
  const animate = useCallback((currentTime: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 帧率控制 - 限制到60FPS以节省性能
    const deltaTime = currentTime - lastFrameTimeRef.current;
    if (deltaTime < 16.67) { // ~60 FPS
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    lastFrameTimeRef.current = currentTime;
    frameCountRef.current++;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const time = currentTime * 0.001;

    // 更新和绘制粒子
    particlesRef.current.forEach((particle, index) => {
      // 更新粒子位置（适当减慢速度）
      particle.x += particle.vx * 0.8;
      particle.y += particle.vy * 0.8;
      particle.life++;

      // 边界检测
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      // 鼠标交互
      if (mouseRef.current.isActive) {
        const dx = particle.x - mouseRef.current.x;
        const dy = particle.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx += (dx / distance) * force * 0.01;
          particle.vy += (dy / distance) * force * 0.01;
        }
      }

      // 限制速度
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (speed > 1) {
        particle.vx = (particle.vx / speed) * 1;
        particle.vy = (particle.vy / speed) * 1;
      }

      // 绘制粒子
      const opacity = particle.opacity * (1 - particle.life / particle.maxLife);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = particle.color;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      // 粒子生命周期结束，重新初始化
      if (particle.life >= particle.maxLife) {
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
        particle.vx = (Math.random() - 0.5) * 0.3;
        particle.vy = (Math.random() - 0.5) * 0.3;
        particle.life = 0;
        particle.color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      }
    });

    // 更新和绘制神经网络节点
    nodesRef.current.forEach((node, index) => {
      // 更新节点位置（减慢移动速度）
      node.x += node.vx * 0.3;
      node.y += node.vy * 0.3;
      // 减慢脉冲动画速度
      node.pulse += 0.008;

      // 边界检测
      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

      // 绘制神经网络连接线 - 更强的连接感
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = `rgba(0, 0, 0, ${0.15 + Math.sin(node.pulse * 2) * 0.05})`;
      ctx.lineWidth = 1.5;

      node.connections.forEach((connectionIndex) => {
        const connectedNode = nodesRef.current[connectionIndex];
        if (connectedNode) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          ctx.stroke();
        }
      });

      // 绘制黑色节点 - 神经网络风格
      const nodeSize = 2 + Math.sin(node.pulse * 1.5) * 0.75;
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = `rgba(0, 0, 0, ${0.7 + Math.sin(node.pulse) * 0.2})`;

      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
      ctx.fill();

      // 添加微弱的光晕效果 - 保持低调
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = `rgba(0, 0, 0, ${0.1 + Math.sin(node.pulse) * 0.05})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize * 2, 0, Math.PI * 2);
      ctx.fill();

      // 添加数据流效果 - 沿着连接线的小亮点
      if (Math.sin(node.pulse * 3) > 0.8) {
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = 'rgba(100, 116, 139, 0.8)';
        node.connections.forEach((connectionIndex) => {
          const connectedNode = nodesRef.current[connectionIndex];
          if (connectedNode) {
            const midX = (node.x + connectedNode.x) / 2;
            const midY = (node.y + connectedNode.y) / 2;
            ctx.beginPath();
            ctx.arc(midX, midY, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }
    });

    // 绘制波浪效果
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
    ctx.lineWidth = 2;

    let waveIndex = 0;
    while (waveIndex < wavesRef.current.length) {
      ctx.beginPath();
      ctx.moveTo(wavesRef.current[waveIndex].x, wavesRef.current[waveIndex].y);

      for (let i = waveIndex; i < waveIndex + Math.floor(canvas.width / 20); i++) {
        if (i >= wavesRef.current.length) break;

        const wave = wavesRef.current[i];
        // 减慢波浪动画速度
        wave.y = wave.baseY + Math.sin(time * wave.frequency * 0.5 + wave.phase) * wave.amplitude;

        if (i === waveIndex) {
          ctx.moveTo(wave.x, wave.y);
        } else {
          ctx.lineTo(wave.x, wave.y);
        }
      }

      ctx.stroke();
      waveIndex += Math.floor(canvas.width / 20) + 1;
    }

    // 绘制浮动几何图形
    const shapes = [
      { x: canvas.width * 0.1, y: canvas.height * 0.2, rotation: time * 0.2, size: 30, type: 'triangle' },
      { x: canvas.width * 0.9, y: canvas.height * 0.8, rotation: time * -0.15, size: 25, type: 'hexagon' },
      { x: canvas.width * 0.8, y: canvas.height * 0.3, rotation: time * 0.25, size: 20, type: 'circle' },
      { x: canvas.width * 0.2, y: canvas.height * 0.7, rotation: time * -0.18, size: 35, type: 'square' },
    ];

    shapes.forEach((shape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = 'rgba(212, 175, 55, 0.1)';
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
      ctx.lineWidth = 1;

      ctx.beginPath();

      switch (shape.type) {
        case 'triangle':
          ctx.moveTo(0, -shape.size);
          ctx.lineTo(-shape.size * 0.866, shape.size * 0.5);
          ctx.lineTo(shape.size * 0.866, shape.size * 0.5);
          ctx.closePath();
          break;
        case 'hexagon':
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = shape.size * Math.cos(angle);
            const y = shape.size * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          break;
        case 'circle':
          ctx.arc(0, 0, shape.size, 0, Math.PI * 2);
          break;
        case 'square':
          ctx.rect(-shape.size, -shape.size, shape.size * 2, shape.size * 2);
          break;
      }

      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    ctx.globalAlpha = 1;

    // 继续下一帧动画
    animationRef.current = requestAnimationFrame(animate);
  }, [colorPalette]);

  // 处理鼠标移动
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      isActive: true,
    };

    // 清除鼠标激活状态
    setTimeout(() => {
      mouseRef.current.isActive = false;
    }, 100);
  }, []);

  // 初始化和清理
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas);
      initNodes(canvas);
      initWaves(canvas);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 页面不可见时暂停动画
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      } else {
        // 页面重新可见时恢复动画
        if (!animationRef.current) {
          animate();
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles, initNodes, initWaves, animate, handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, rgba(250, 250, 249, 0.95) 0%, rgba(254, 254, 254, 0.98) 100%)',
      }}
    />
  );
}
