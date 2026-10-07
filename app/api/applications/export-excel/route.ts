import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';
import * as XLSX from 'xlsx';

export async function GET() {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  const applications = await prisma.application.findMany({
    include: { course: true },
    orderBy: { createdAt: 'desc' },
  });

  const rows = applications.map((a) => ({
    'Имя': a.name,
    'Телефон': a.phone,
    'Telegram': a.telegram ?? '',
    'Курс': a.course?.title ?? '',
    'Формат': a.format ?? '',
    'Удобное время': a.preferredTime ?? '',
    'Комментарий': a.comment ?? '',
    'Статус': a.status,
    'Источник (UTM)': a.utmSource ?? '',
    'Дата': new Date(a.createdAt).toLocaleString('ru-RU'),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet['!cols'] = [
    { wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 24 }, { wch: 10 },
    { wch: 16 }, { wch: 30 }, { wch: 12 }, { wch: 14 }, { wch: 18 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Заявки');

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="applications.xlsx"',
    },
  });
}