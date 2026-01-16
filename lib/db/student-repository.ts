import { prisma } from './prisma';

// 学生信息接口
export interface StudentRecord {
  id: string; // 唯一标识符，通常使用英文名或拼音
  chineseName: string; // 中文名
  englishName?: string; // 英文名
  grade: string; // 年级，如 "2023级硕士", "2024级博士"
  degree: string; // 学位，如 "硕士研究生", "博士研究生"
  research?: string; // 研究方向
  bio?: string; // 自我介绍
  email?: string; // 邮箱
  phone?: string; // 电话
  avatar?: string; // 头像路径
  github?: string; // GitHub链接
  linkedin?: string; // LinkedIn链接
  website?: string; // 个人网站
  skills?: string; // 技能
  interests?: string; // 兴趣爱好
  publications?: string; // 发表论文/项目
  createdAt: Date;
  updatedAt: Date;
}

// 创建学生记录
export async function createStudent(student: Omit<StudentRecord, 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const newStudent = await prisma.student.create({
      data: {
        id: student.id,
        chineseName: student.chineseName,
        englishName: student.englishName,
        grade: student.grade,
        degree: student.degree,
        research: student.research || '',
        bio: student.bio,
        email: student.email || '',
        phone: student.phone || '',
        avatar: student.avatar || '',
        github: student.github || '',
        linkedin: student.linkedin || '',
        website: student.website || '',
        skills: student.skills || '',
        interests: student.interests || '',
        publications: student.publications || '',
      },
    });

    console.log(`Student record created: ${student.id}`);
    return student.id;
  } catch (error) {
    console.error('Failed to create student record:', error);
    // 如果数据库不可用，返回传入的ID但记录警告
    console.warn('Database unavailable for createStudent, returning provided ID');
    return student.id;
  }
}

// 根据ID获取学生信息
export async function getStudentById(id: string): Promise<StudentRecord | null> {
  try {
    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return null;
    }

    return {
      id: student.id,
      chineseName: student.chineseName,
      englishName: student.englishName || undefined,
      grade: student.grade,
      degree: student.degree,
      research: student.research || undefined,
      bio: student.bio || undefined,
      email: student.email || undefined,
      phone: student.phone || undefined,
      avatar: student.avatar || undefined,
      github: student.github || undefined,
      linkedin: student.linkedin || undefined,
      website: student.website || undefined,
      skills: student.skills || undefined,
      interests: student.interests || undefined,
      publications: student.publications || undefined,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };
  } catch (error) {
    // 如果数据库不可用，返回null让前端处理
    console.warn('Database unavailable for getStudentById:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

// 获取所有学生信息
export async function getAllStudents(): Promise<StudentRecord[]> {
  try {
    const students = await prisma.student.findMany({
      orderBy: [
        { grade: 'desc' },
        { chineseName: 'asc' },
      ],
    });

    return students.map(student => ({
      id: student.id,
      chineseName: student.chineseName,
      englishName: student.englishName || undefined,
      grade: student.grade,
      degree: student.degree,
      research: student.research || undefined,
      bio: student.bio || undefined,
      email: student.email || undefined,
      phone: student.phone || undefined,
      avatar: student.avatar || undefined,
      github: student.github || undefined,
      linkedin: student.linkedin || undefined,
      website: student.website || undefined,
      skills: student.skills || undefined,
      interests: student.interests || undefined,
      publications: student.publications || undefined,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    }));
  } catch (error) {
    console.error('Failed to get all students:', error);
    // 如果数据库不可用，返回空数组
    console.warn('Database unavailable for getAllStudents');
    return [];
  }
}

// 根据年级获取学生信息
export async function getStudentsByGrade(grade: string): Promise<StudentRecord[]> {
  try {
    const students = await prisma.student.findMany({
      where: { grade },
      orderBy: { chineseName: 'asc' },
    });

    return students.map(student => ({
      id: student.id,
      chineseName: student.chineseName,
      englishName: student.englishName || undefined,
      grade: student.grade,
      degree: student.degree,
      research: student.research || undefined,
      bio: student.bio || undefined,
      email: student.email || undefined,
      phone: student.phone || undefined,
      avatar: student.avatar || undefined,
      github: student.github || undefined,
      linkedin: student.linkedin || undefined,
      website: student.website || undefined,
      skills: student.skills || undefined,
      interests: student.interests || undefined,
      publications: student.publications || undefined,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    }));
  } catch (error) {
    console.error('Failed to get students by grade:', error);
    // 如果数据库不可用，返回空数组
    console.warn('Database unavailable for getStudentsByGrade');
    return [];
  }
}

// 更新学生信息
export async function updateStudent(id: string, updates: Partial<Omit<StudentRecord, 'id' | 'createdAt' | 'updatedAt'>>): Promise<boolean> {
  try {
    const updateData: any = {};

    if (updates.chineseName !== undefined) updateData.chineseName = updates.chineseName;
    if (updates.englishName !== undefined) updateData.englishName = updates.englishName;
    if (updates.grade !== undefined) updateData.grade = updates.grade;
    if (updates.degree !== undefined) updateData.degree = updates.degree;
    if (updates.research !== undefined) updateData.research = updates.research;
    if (updates.bio !== undefined) updateData.bio = updates.bio;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.avatar !== undefined) updateData.avatar = updates.avatar;
    if (updates.github !== undefined) updateData.github = updates.github;
    if (updates.linkedin !== undefined) updateData.linkedin = updates.linkedin;
    if (updates.website !== undefined) updateData.website = updates.website;
    if (updates.skills !== undefined) updateData.skills = updates.skills;
    if (updates.interests !== undefined) updateData.interests = updates.interests;
    if (updates.publications !== undefined) updateData.publications = updates.publications;

    const result = await prisma.student.update({
      where: { id },
      data: updateData,
    });

    return !!result;
  } catch (error) {
    console.error('Failed to update student:', error);
    // 如果数据库不可用，返回false
    console.warn('Database unavailable for updateStudent');
    return false;
  }
}

// 删除学生记录
export async function deleteStudent(id: string): Promise<boolean> {
  try {
    const result = await prisma.student.delete({
      where: { id },
    });

    return !!result;
  } catch (error) {
    console.error('Failed to delete student:', error);
    // 如果数据库不可用，返回false
    console.warn('Database unavailable for deleteStudent');
    return false;
  }
}

// 搜索学生
export async function searchStudents(searchTerm: string): Promise<StudentRecord[]> {
  try {
    const students = await prisma.student.findMany({
      where: {
        OR: [
          { chineseName: { contains: searchTerm, mode: 'insensitive' } },
          { englishName: { contains: searchTerm, mode: 'insensitive' } },
          { bio: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      orderBy: [
        { grade: 'desc' },
        { chineseName: 'asc' },
      ],
    });

    return students.map(student => ({
      id: student.id,
      chineseName: student.chineseName,
      englishName: student.englishName || undefined,
      grade: student.grade,
      degree: student.degree,
      research: student.research || undefined,
      bio: student.bio || undefined,
      email: student.email || undefined,
      phone: student.phone || undefined,
      avatar: student.avatar || undefined,
      github: student.github || undefined,
      linkedin: student.linkedin || undefined,
      website: student.website || undefined,
      skills: student.skills || undefined,
      interests: student.interests || undefined,
      publications: student.publications || undefined,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    }));
  } catch (error) {
    console.error('Failed to search students:', error);
    // 如果数据库不可用，返回空数组
    console.warn('Database unavailable for searchStudents');
    return [];
  }
}
