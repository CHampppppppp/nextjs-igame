'use client';

import { useState, useEffect } from 'react';

interface CanvasSettings {
  particleCount: number;
  nodeCount: number;
  animationSpeed: number;
  showParticles: boolean;
  showNodes: boolean;
  showWaves: boolean;
  showShapes: boolean;
}

interface CanvasBackgroundControlsProps {
  onSettingsChange?: (settings: CanvasSettings) => void;
}

export default function CanvasBackgroundControls({ onSettingsChange }: CanvasBackgroundControlsProps) {
  const [settings, setSettings] = useState<CanvasSettings>({
    particleCount: 80,
    nodeCount: 20,
    animationSpeed: 1,
    showParticles: true,
    showNodes: true,
    showWaves: true,
    showShapes: true,
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onSettingsChange?.(settings);
  }, [settings, onSettingsChange]);

  const updateSetting = <K extends keyof CanvasSettings>(
    key: K,
    value: CanvasSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* 控制面板触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-primary-charcoal/90 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-accent-blue transition-all duration-300 shadow-lg hover:shadow-xl"
        title="Canvas背景设置"
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      </button>

      {/* 控制面板 */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6 animate-slide-up">
          <h3 className="text-lg font-medium text-primary-charcoal mb-4">Canvas背景设置</h3>

          <div className="space-y-4">
            {/* 粒子数量 */}
            <div>
              <label className="block text-sm font-medium text-secondary-slate mb-2">
                粒子数量: {settings.particleCount}
              </label>
              <input
                type="range"
                min="20"
                max="200"
                value={settings.particleCount}
                onChange={(e) => updateSetting('particleCount', parseInt(e.target.value))}
                className="w-full h-2 bg-secondary-slate/20 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 节点数量 */}
            <div>
              <label className="block text-sm font-medium text-secondary-slate mb-2">
                节点数量: {settings.nodeCount}
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={settings.nodeCount}
                onChange={(e) => updateSetting('nodeCount', parseInt(e.target.value))}
                className="w-full h-2 bg-secondary-slate/20 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 动画速度 */}
            <div>
              <label className="block text-sm font-medium text-secondary-slate mb-2">
                动画速度: {settings.animationSpeed.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={settings.animationSpeed}
                onChange={(e) => updateSetting('animationSpeed', parseFloat(e.target.value))}
                className="w-full h-2 bg-secondary-slate/20 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 显示选项 */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'showParticles', label: '粒子效果' },
                { key: 'showNodes', label: '节点网络' },
                { key: 'showWaves', label: '波浪效果' },
                { key: 'showShapes', label: '几何图形' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[key as keyof CanvasSettings] as boolean}
                    onChange={(e) => updateSetting(key as keyof CanvasSettings, e.target.checked)}
                    className="w-4 h-4 text-accent-gold bg-secondary-slate/20 border-secondary-slate/40 rounded focus:ring-accent-gold/50 focus:ring-2"
                  />
                  <span className="text-sm text-secondary-slate">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 重置按钮 */}
          <button
            onClick={() => setSettings({
              particleCount: 80,
              nodeCount: 20,
              animationSpeed: 1,
              showParticles: true,
              showNodes: true,
              showWaves: true,
              showShapes: true,
            })}
            className="w-full mt-4 px-4 py-2 bg-secondary-slate/10 hover:bg-secondary-slate/20 text-secondary-slate rounded-lg transition-colors duration-200"
          >
            重置为默认
          </button>
        </div>
      )}
    </>
  );
}
