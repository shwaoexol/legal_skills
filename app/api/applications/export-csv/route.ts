import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';

export async function GET() {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  const applications = await prisma.application.findMany({
    include: { course: true },
    orderBy: { createdAt: 'desc' },
  });

  const header = ['Имя', 'Телефон', 'Telegram', 'Курс', 'Формат', 'Комментарий', 'Статус', 'Дата'];
  const rows = applications.map((a) => [
    a.name,
    a.phone,
    a.telegram ?? '',
    a.course?.title ?? '',
    a.format ?? '',
    (a.comment ?? '').replace(/\n/g, ' '),
    a.status,
    new Date(a.createdAt).toLocaleString('ru-RU'),
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return new NextResponse('\uFEFF' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="applications.csv"',
    },
  });
}