'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface MemoryUploadProps {
  onUploadSuccess?: () => void;
}

export default function MemoryUpload({ onUploadSuccess }: MemoryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    const title = titleInputRef.current?.value?.trim();

    if (!file) {
      setUploadStatus('请选择要上传的文件');
      return;
    }

    if (!title) {
      setUploadStatus('请输入文档标题');
      return;
    }

    setIsUploading(true);
    setUploadStatus('正在上传和处理文档...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);

      const response = await fetch('/api/memories/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus(`上传成功！已创建 ${result.chunksCount} 个文档块`);
        // 清空表单
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (titleInputRef.current) titleInputRef.current.value = '';
        onUploadSuccess?.();
      } else {
        setUploadStatus(`上传失败: ${result.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('上传过程中发生错误');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitText = async () => {
    const title = titleInputRef.current?.value?.trim();
    const text = textInputRef.current?.value?.trim();
    if (!title) {
      setUploadStatus('请输入文档标题');
      return;
    }
    if (!text) {
      setUploadStatus('请输入文本内容');
      return;
    }
    setIsUploading(true);
    setUploadStatus('正在提交文本并处理...');
    try {
      const response = await fetch('/api/memories/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, text }),
      });
      const result = await response.json();
      if (response.ok) {
        setUploadStatus(`提交成功！已创建 ${result.chunksCount} 个文档块`);
        if (textInputRef.current) textInputRef.current.value = '';
        if (titleInputRef.current) titleInputRef.current.value = '';
        onUploadSuccess?.();
      } else {
        setUploadStatus(`提交失败: ${result.error}`);
      }
    } catch (error) {
      console.error('Text submit error:', error);
      setUploadStatus('提交过程中发生错误');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-900">上传记忆文档</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            文档标题
          </label>
          <input
            ref={titleInputRef}
            type="text"
            placeholder="输入文档标题..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            手动输入文本
          </label>
          <textarea
            ref={textInputRef}
            rows={6}
            placeholder="在这里粘贴或输入文本..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
          <p className="text-xs text-gray-500 mt-1">
            系统会自动分割文本并向量化处理
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择文件
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.md"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            支持的文件类型: .txt, .pdf, .md
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSubmitText}
            disabled={isUploading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors"
          >
            {isUploading ? '提交中...' : '提交文本'}
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors"
          >
            {isUploading ? '上传中...' : '上传文件'}
          </button>
        </div>

        {uploadStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm p-3 rounded-md ${
              uploadStatus.includes('成功')
                ? 'bg-green-100 text-green-800'
                : uploadStatus.includes('失败') || uploadStatus.includes('错误')
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {uploadStatus}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
