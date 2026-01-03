import { query } from './mysql';

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
    const sql = `
      INSERT INTO students (
        id, chinese_name, english_name, grade, degree, research, bio,
        email, phone, avatar, github, linkedin, website, skills,
        interests, publications, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, '', ?, '', '', '', '', '', '', '', '', '', NOW(), NOW())
    `;

    const params = [
      student.id,
      student.chineseName,
      student.englishName || null,
      student.grade,
      student.degree,
      student.bio,
    ];

    await query(sql, params);
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
    const sql = `
      SELECT
        id, chinese_name as chineseName, english_name as englishName,
        grade, degree, research, bio, email, phone, avatar, github,
        linkedin, website, skills, interests, publications,
        created_at as createdAt, updated_at as updatedAt
      FROM students
      WHERE id = ?
    `;

    const rows = await query(sql, [id]);

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return {
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
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
    const sql = `
      SELECT
        id, chinese_name as chineseName, english_name as englishName,
        grade, degree, research, bio, email, phone, avatar, github,
        linkedin, website, skills, interests, publications,
        created_at as createdAt, updated_at as updatedAt
      FROM students
      ORDER BY grade DESC, chinese_name ASC
    `;

    const rows = await query(sql);

    return rows.map((row: any) => ({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
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
    const sql = `
      SELECT
        id, chinese_name as chineseName, english_name as englishName,
        grade, degree, research, bio, email, phone, avatar, github,
        linkedin, website, skills, interests, publications,
        created_at as createdAt, updated_at as updatedAt
      FROM students
      WHERE grade = ?
      ORDER BY chinese_name ASC
    `;

    const rows = await query(sql, [grade]);

    return rows.map((row: any) => ({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
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
    const sql = `
      UPDATE students
      SET chinese_name = ?, english_name = ?, grade = ?, degree = ?, bio = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const params = [
      updates.chineseName,
      updates.englishName || null,
      updates.grade,
      updates.degree,
      updates.bio,
      id,
    ];

    const result = await query(sql, params);
    const affectedRows = (result as any).affectedRows || 0;

    return affectedRows > 0;
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
    const sql = `DELETE FROM students WHERE id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = (result as any).affectedRows || 0;

    return affectedRows > 0;
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
    const sql = `
      SELECT
        id, chinese_name as chineseName, english_name as englishName,
        grade, degree, research, bio, email, phone, avatar, github,
        linkedin, website, skills, interests, publications,
        created_at as createdAt, updated_at as updatedAt
      FROM students
      WHERE chinese_name LIKE ? OR english_name LIKE ? OR bio LIKE ?
      ORDER BY grade DESC, chinese_name ASC
    `;

    const searchPattern = `%${searchTerm}%`;
    const rows = await query(sql, [searchPattern, searchPattern, searchPattern]);

    return rows.map((row: any) => ({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  } catch (error) {
    console.error('Failed to search students:', error);
    // 如果数据库不可用，返回空数组
    console.warn('Database unavailable for searchStudents');
    return [];
  }
}
