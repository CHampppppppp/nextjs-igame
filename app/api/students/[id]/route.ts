import { NextRequest, NextResponse } from 'next/server';
import {
  getStudentById,
  updateStudent,
  deleteStudent,
  createStudent
} from '../../../../lib/db/student-repository';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - 获取学生信息
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const studentId = resolvedParams.id;

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    const student = await getStudentById(studentId);

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('Failed to get student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - 更新学生信息
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const studentId = resolvedParams.id;

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      chineseName,
      englishName,
      grade,
      degree,
      bio,
    } = body;

    // 验证必填字段
    if (!chineseName || !grade || !degree || !bio) {
      return NextResponse.json(
        { error: 'Chinese name, grade, degree, and bio are required' },
        { status: 400 }
      );
    }

    // 检查学生是否存在
    const existingStudent = await getStudentById(studentId);
    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // 更新学生信息
    const success = await updateStudent(studentId, {
      chineseName,
      englishName,
      grade,
      degree,
      research: '', // 保留其他字段为空
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

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update student' },
        { status: 500 }
      );
    }

    // 返回更新后的学生信息
    const updatedStudent = await getStudentById(studentId);
    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error('Failed to update student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - 删除学生信息
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const studentId = resolvedParams.id;

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // 检查学生是否存在
    const existingStudent = await getStudentById(studentId);
    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // 删除学生
    const success = await deleteStudent(studentId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete student' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Failed to delete student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
