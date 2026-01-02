'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 粒子系统组件
function Particles() {
  const ref = useRef<THREE.Points>(null!);

  // 生成随机粒子位置
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(1000 * 3); // 1000个粒子，每个有x,y,z坐标

    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
    }

    return positions;
  }, []);

  // 生成随机粒子颜色
  const particlesColor = useMemo(() => {
    const colors = new Float32Array(1000 * 3);

    const colorPalette = [
      [0.25, 0.63, 0.95], // 科技蓝
      [0.31, 0.27, 0.9],  // 靛蓝
      [0.47, 0.22, 0.94], // 紫色
      [0.1, 0.98, 0.81],  // 翠绿
    ];

    for (let i = 0; i < 1000; i++) {
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color[0];     // r
      colors[i * 3 + 1] = color[1]; // g
      colors[i * 3 + 2] = color[2]; // b
    }

    return colors;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      // 缓慢旋转粒子系统
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors={true}
      />
    </Points>
  );
}

// 3D几何图形组件
function GeometricShapes() {
  const meshRef1 = useRef<THREE.Mesh>(null!);
  const meshRef2 = useRef<THREE.Mesh>(null!);
  const meshRef3 = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (meshRef1.current) {
      meshRef1.current.rotation.x = time * 0.5;
      meshRef1.current.rotation.y = time * 0.3;
      meshRef1.current.position.y = Math.sin(time * 0.8) * 0.5;
    }

    if (meshRef2.current) {
      meshRef2.current.rotation.x = time * -0.3;
      meshRef2.current.rotation.z = time * 0.4;
      meshRef2.current.position.x = Math.cos(time * 0.6) * 0.8;
    }

    if (meshRef3.current) {
      meshRef3.current.rotation.y = time * 0.7;
      meshRef3.current.rotation.z = time * -0.2;
      meshRef3.current.position.z = Math.sin(time * 0.4) * 0.3;
    }
  });

  return (
    <group>
      {/* 透明立方体 */}
      <mesh ref={meshRef1} position={[3, 1, -2]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#2563eb"
          transparent
          opacity={0.3}
          wireframe={false}
        />
      </mesh>

      {/* 透明球体 */}
      <mesh ref={meshRef2} position={[-3, -1, -3]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#7c3aed"
          transparent
          opacity={0.4}
          wireframe={false}
        />
      </mesh>

      {/* 透明环形 */}
      <mesh ref={meshRef3} position={[0, 2, -4]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.1, 8, 16]} />
        <meshStandardMaterial
          color="#10b981"
          transparent
          opacity={0.5}
          wireframe={false}
        />
      </mesh>
    </group>
  );
}

// 主粒子背景组件
export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* 环境光 */}
        <ambientLight intensity={0.5} />

        {/* 点光源 */}
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />

        {/* 粒子系统 */}
        <Particles />

        {/* 几何图形 */}
        <GeometricShapes />
      </Canvas>
    </div>
  );
}
