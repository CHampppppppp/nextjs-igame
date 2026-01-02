'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MemoryUpload from '../../components/ai/memory-upload';
import Link from 'next/link';

interface MemoryDocument {
  id: string;
  content: string;
  metadata: {
    title?: string;
    type?: string;
    createdAt: string;
    fileName?: string;
  };
}

export default function MemoriesAdminPage() {
  const [documents, setDocuments] = useState<MemoryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/memories');
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (documentId: string) => {
    if (!confirm('确定要删除这个文档吗？此操作无法撤销。')) return;

    setDeletingId(documentId);
    try {
      const response = await fetch('/api/memories', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId }),
      });

      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      } else {
        alert('删除失败');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('删除过程中发生错误');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部导航 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI记忆文档管理</h1>
              <p className="text-gray-600 mt-2">管理iGame Lab AI助手的知识库</p>
            </div>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 上传区域 */}
          <div className="lg:col-span-1">
            <MemoryUpload onUploadSuccess={fetchDocuments} />
          </div>

          {/* 文档列表 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                记忆文档列表 ({documents.length})
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">加载中...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>暂无记忆文档</p>
                  <p className="text-sm">上传文档来丰富AI助手的知识库</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-2">
                            {doc.metadata.title || '未命名文档'}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                            {doc.content.substring(0, 200)}...
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>类型: {doc.metadata.type || '未知'}</span>
                            <span>创建时间: {new Date(doc.metadata.createdAt).toLocaleString('zh-CN')}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          disabled={deletingId === doc.id}
                          className="ml-4 text-red-500 hover:text-red-700 disabled:text-gray-400"
                        >
                          {deletingId === doc.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">使用说明</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• 支持上传 .txt、.pdf 和 .md 格式的文档</li>
            <li>• 系统会自动将文档分割成合适大小的块进行向量化处理</li>
            <li>• AI助手会基于这些文档内容回答用户的问题</li>
            <li>• 定期更新文档可以提升AI助手的回答质量</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


