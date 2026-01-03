import { NextRequest, NextResponse } from 'next/server';
import {
  createStudent,
  getAllStudents,
  getStudentsByGrade,
  searchStudents
} from '../../../lib/db/student-repository';

// GET - 获取学生列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');
    const search = searchParams.get('search');

    let students;

    if (search) {
      // 搜索学生
      students = await searchStudents(search);
    } else if (grade) {
      // 根据年级获取学生
      students = await getStudentsByGrade(grade);
    } else {
      // 获取所有学生
      students = await getAllStudents();
    }

    return NextResponse.json(students);
  } catch (error) {
    console.error('Failed to get students:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - 创建新学生
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      id,
      chineseName,
      englishName,
      grade,
      degree,
      bio,
    } = body;

    // 验证必填字段
    if (!id || !chineseName || !grade || !degree || !bio) {
      return NextResponse.json(
        { error: 'ID, Chinese name, grade, degree, and bio are required' },
        { status: 400 }
      );
    }

    // 创建学生记录
    const studentId = await createStudent({
      id,
      chineseName,
      englishName,
      grade,
      degree,
      research: '', // 这些字段现在为空，但保留在数据库结构中以备将来扩展
      bio,
      email: '',
      phone: '',
      avatar: '',
      github: '',
      linkedin: '',
      website: '',
      skills: '',
      interests: '',
      publications: '',
    });

    // 返回创建的学生信息
    const { getStudentById } = await import('../../../lib/db/student-repository');
    const newStudent = await getStudentById(studentId);

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Failed to create student:', error);

    // 检查是否是重复ID错误
    if (error instanceof Error && error.message.includes('Duplicate entry')) {
      return NextResponse.json(
        { error: 'Student ID already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
