import { requireAdmin } from '@/lib/require-admin';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { teacherSchema } from '@/lib/validations';

export async function GET() {
  const teachers = await prisma.teacher.findMany({
    where: { isPublished: true },
    orderBy: { fullName: 'asc' },
  });
  return NextResponse.json(teachers);
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  const body = await req.json();

  const parsed = teacherSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Ошибка валидации', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const teacher = await prisma.teacher.create({
      data: parsed.data,
    });
    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Не удалось создать преподавателя' },
      { status: 500 }
    );
  }
}