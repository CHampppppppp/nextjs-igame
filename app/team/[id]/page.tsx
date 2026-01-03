'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ScrollReveal } from '../../components/layout/page-transition';
import { StudentRecord } from '../../../lib/db/student-repository';

// 默认头像 (SVG data URL)
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,' + btoa(`
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="100" fill="#f3f4f6"/>
  <circle cx="100" cy="80" r="30" fill="#d1d5db"/>
  <path d="M40 160 Q40 120 70 120 L130 120 Q160 120 160 160" fill="#d1d5db"/>
</svg>
`);

interface StudentFormData {
  chineseName: string;
  englishName: string;
  grade: string;
  degree: string;
  bio: string;
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentFormData>({
    chineseName: '',
    englishName: '',
    grade: '',
    degree: '',
    bio: '',
  });
  const [saving, setSaving] = useState(false);

  // 根据学生ID生成预填充数据
  const generatePrefilledData = (id: string): StudentFormData => {
    // 尝试从ID中提取英文名
    const englishName = id.split('_').map(part =>
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');

    return {
      chineseName: '',
      englishName,
      grade: '',
      degree: '',
      bio: '',
    };
  };

  // 获取学生信息
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${studentId}`);
        if (response.ok) {
          const data = await response.json();
          setStudent(data);
          setFormData({
            chineseName: data.chineseName || '',
            englishName: data.englishName || '',
            grade: data.grade || '',
            degree: data.degree || '',
            bio: data.bio || '',
          });
        } else if (response.status === 404) {
          // 学生不存在，这是正常的，创建一个新的
          console.log(`学生 ${studentId} 不存在，进入创建模式`);
          setStudent(null);

          // 预填充表单数据
          const prefilledData = generatePrefilledData(studentId);
          setFormData(prefilledData);
          setIsEditing(true);
        } else {
          // 其他错误才抛出异常
          throw new Error(`获取学生信息失败: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        console.error('获取学生信息时出错:', err);
        setError(err instanceof Error ? err.message : '获取学生信息失败');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  // 保存学生信息
  const handleSave = async () => {
    // 客户端验证必填字段
    if (!formData.chineseName.trim()) {
      setError('中文名不能为空');
      return;
    }
    if (!formData.grade) {
      setError('请选择年级');
      return;
    }
    if (!formData.degree) {
      setError('请选择学位');
      return;
    }
    if (!formData.bio.trim()) {
      setError('请填写自我介绍');
      return;
    }

    setSaving(true);
    try {
      const method = student ? 'PUT' : 'POST';
      const url = student ? `/api/students/${studentId}` : '/api/students';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: studentId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStudent(data);
        setIsEditing(false);
        setError(null);
      } else {
        const errorData = await response.json().catch(() => ({ error: '保存失败' }));
        throw new Error(errorData.error || 'Failed to save student');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // 删除学生信息
  const handleDelete = async () => {
    if (!student || !confirm('确定要删除这个学生信息吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/team');
      } else {
        throw new Error('Failed to delete student');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  // 取消编辑
  const handleCancel = () => {
    if (student) {
      setFormData({
        chineseName: student.chineseName || '',
        englishName: student.englishName || '',
        grade: student.grade || '',
        degree: student.degree || '',
        bio: student.bio || '',
      });
    }
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  if (error && !isEditing) {
    return (
      <div className="min-h-screen bg-warm flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-text-muted mb-4">{error}</p>
          <Link href="/team" className="elegant-button">
            返回团队页面
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm">
      {/* 页面标题 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <Link href="/team" className="inline-flex items-center text-text-muted hover:text-primary-charcoal mb-4">
            <i className="bi bi-arrow-left mr-2"></i>
            返回团队页面
          </Link>
          <h1 className="text-4xl font-bold text-primary-charcoal mb-4 elegant-heading">
            {student ? `${student.chineseName}${student.englishName ? ` (${student.englishName})` : ''}` : '创建学生信息'}
          </h1>
          <p className="text-lg elegant-subheading max-w-3xl mx-auto">
            {student ? 'Student Profile' : `Create New Student Profile - ${studentId.replace(/_/g, ' ')}`}
          </p>
          {!student && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-3xl mx-auto">
              <p className="text-blue-800 text-center">
                👋 欢迎创建学生资料！请填写以下信息来创建您的个人资料。
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* 操作按钮 */}
        <div className="flex justify-between items-center gap-4 mb-8">
          <div>
            {!student && (
              <div className="text-sm text-text-muted">
                <i className="bi bi-info-circle mr-1"></i>
                该学生信息尚未创建，请填写以下信息创建个人资料
              </div>
            )}
          </div>
          <div className="flex gap-4">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="elegant-button bg-accent-blue hover:bg-accent-blue/80"
                >
                  <i className="bi bi-pencil mr-2"></i>
                  编辑信息
                </button>
                {student && (
                  <button
                    onClick={handleDelete}
                    className="elegant-button bg-red-500 hover:bg-red-600 text-white"
                  >
                    <i className="bi bi-trash mr-2"></i>
                    删除
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="elegant-button bg-gray-500 hover:bg-gray-600 text-white"
                  disabled={saving}
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="elegant-button bg-green-500 hover:bg-green-600 text-white"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      保存中...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle mr-2"></i>
                      保存
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 学生信息卡片 */}
        <ScrollReveal>
          <motion.div
            className="bg-white rounded-xl shadow-sm p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* 左侧 - 头像和基本信息 */}
              <div className="lg:w-1/3">
                <div className="text-center">
                  <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden bg-gray-100">
                    <Image
                      src={student?.avatar || DEFAULT_AVATAR}
                      alt={isEditing ? formData.chineseName : student?.chineseName || 'Student'}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_AVATAR;
                      }}
                    />
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="中文名"
                        value={formData.chineseName}
                        onChange={(e) => setFormData({ ...formData, chineseName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        placeholder="英文名 (可选)"
                        value={formData.englishName}
                        onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold text-primary-charcoal mb-2">
                        {student?.chineseName}
                      </h2>
                      {student?.englishName && (
                        <p className="text-lg text-text-muted mb-4">
                          {student.englishName}
                        </p>
                      )}
                      <div className="text-sm text-text-muted mb-2">
                        {student?.grade} {student?.degree}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 右侧 - 自我介绍 */}
              <div className="lg:w-2/3">
                <div className="space-y-6">
                  {/* 年级和学位 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-charcoal mb-2">
                        年级
                      </label>
                      {isEditing ? (
                        <select
                          value={formData.grade}
                          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                          required
                        >
                          <option value="">选择年级</option>
                          <option value="2023级硕士">2023级硕士</option>
                          <option value="2024级硕士">2024级硕士</option>
                          <option value="2025级硕士">2025级硕士</option>
                          <option value="2024级博士">2024级博士</option>
                          <option value="2025级博士">2025级博士</option>
                        </select>
                      ) : (
                        <p className="text-text-muted">{student?.grade}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-charcoal mb-2">
                        学位
                      </label>
                      {isEditing ? (
                        <select
                          value={formData.degree}
                          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                          required
                        >
                          <option value="">选择学位</option>
                          <option value="硕士研究生">硕士研究生</option>
                          <option value="博士研究生">博士研究生</option>
                        </select>
                      ) : (
                        <p className="text-text-muted">{student?.degree}</p>
                      )}
                    </div>
                  </div>

                  {/* 自我介绍 */}
                  <div>
                    <label className="block text-sm font-medium text-primary-charcoal mb-2">
                      自我介绍
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                        placeholder="请填写您的自我介绍..."
                        required
                      />
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-text-muted whitespace-pre-wrap leading-relaxed">
                          {student?.bio || '暂无自我介绍'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </div>
  );
}
