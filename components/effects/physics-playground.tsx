'use client';

import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { motion } from 'framer-motion';

// 物理世界配置
const PhysicsPlayground = ({ isActive = true }: { isActive?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine>();
  const renderRef = useRef<Matter.Render>();
  const runnerRef = useRef<Matter.Runner>();
  const [bodies, setBodies] = useState<Matter.Body[]>([]);

  useEffect(() => {
    if (!canvasRef.current || !isActive) return;

    // 创建物理引擎
    const engine = Matter.Engine.create();
    engine.world.gravity.y = 0.5; // 轻微重力
    engineRef.current = engine;

    // 创建渲染器
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: canvasRef.current.clientWidth,
        height: canvasRef.current.clientHeight,
        wireframes: false,
        background: 'transparent',
        showAngleIndicator: false,
        showVelocity: false
      }
    });
    renderRef.current = render;

    // 创建边界墙壁
    const walls = [
      // 上墙
      Matter.Bodies.rectangle(
        canvasRef.current.clientWidth / 2,
        -10,
        canvasRef.current.clientWidth,
        20,
        { isStatic: true, render: { visible: false } }
      ),
      // 下墙
      Matter.Bodies.rectangle(
        canvasRef.current.clientWidth / 2,
        canvasRef.current.clientHeight + 10,
        canvasRef.current.clientWidth,
        20,
        { isStatic: true, render: { visible: false } }
      ),
      // 左墙
      Matter.Bodies.rectangle(
        -10,
        canvasRef.current.clientHeight / 2,
        20,
        canvasRef.current.clientHeight,
        { isStatic: true, render: { visible: false } }
      ),
      // 右墙
      Matter.Bodies.rectangle(
        canvasRef.current.clientWidth + 10,
        canvasRef.current.clientHeight / 2,
        20,
        canvasRef.current.clientHeight,
        { isStatic: true, render: { visible: false } }
      )
    ];

    // 创建随机形状
    const shapes: Matter.Body[] = [];
    const colors = ['#2563eb', '#4f46e5', '#7c3aed', '#10b981', '#f59e0b'];

    for (let i = 0; i < 15; i++) {
      const x = Math.random() * canvasRef.current.clientWidth;
      const y = Math.random() * 100 + 50;
      const size = Math.random() * 30 + 20;
      const color = colors[Math.floor(Math.random() * colors.length)];

      // 随机创建圆形或矩形
      const shape = Math.random() > 0.5
        ? Matter.Bodies.circle(x, y, size / 2, {
            render: {
              fillStyle: color,
              strokeStyle: color,
              lineWidth: 2
            },
            friction: 0.3,
            restitution: 0.8
          })
        : Matter.Bodies.rectangle(x, y, size, size, {
            render: {
              fillStyle: color,
              strokeStyle: color,
              lineWidth: 2
            },
            friction: 0.3,
            restitution: 0.8
          });

      shapes.push(shape);
    }

    // 添加所有物体到世界
    Matter.World.add(engine.world, [...walls, ...shapes]);
    setBodies(shapes);

    // 创建运行器
    const runner = Matter.Runner.create();
    runnerRef.current = runner;

    // 启动渲染和运行器
    Matter.Render.run(render);
    Matter.Runner.run(runner, engine);

    // 添加鼠标控制
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Matter.World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    return () => {
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (renderRef.current) Matter.Render.stop(renderRef.current);
      if (engineRef.current) Matter.World.clear(engineRef.current.world, false);
      if (renderRef.current.canvas?.parentNode) {
        renderRef.current.canvas.parentNode.removeChild(renderRef.current.canvas);
      }
    };
  }, [isActive]);

  // 处理点击添加新物体
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!engineRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const colors = ['#2563eb', '#4f46e5', '#7c3aed', '#10b981', '#f59e0b'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 25 + 15;

    const newBody = Math.random() > 0.5
      ? Matter.Bodies.circle(x, y, size / 2, {
          render: {
            fillStyle: color,
            strokeStyle: color,
            lineWidth: 2
          },
          friction: 0.3,
          restitution: 0.8
        })
      : Matter.Bodies.rectangle(x, y, size, size, {
          render: {
            fillStyle: color,
            strokeStyle: color,
            lineWidth: 2
          },
          friction: 0.3,
          restitution: 0.8
        });

    Matter.World.add(engineRef.current.world, newBody);
    setBodies(prev => [...prev, newBody]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 -z-20 pointer-events-auto"
    >
      <canvas
        ref={canvasRef}
        width={typeof window !== 'undefined' ? window.innerWidth : 1920}
        height={typeof window !== 'undefined' ? window.innerHeight : 1080}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair"
        style={{ background: 'transparent' }}
      />
    </motion.div>
  );
};

export default PhysicsPlayground;
