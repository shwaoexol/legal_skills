import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { applicationSchema } from '@/lib/validations';
import { requireAdmin } from '@/lib/require-admin';
import { notifyNewApplication } from '@/lib/telegram';

const recentRequests = new Map<string, number[]>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (recentRequests.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  recentRequests.set(ip, timestamps);
  return timestamps.length > LIMIT;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Слишком много запросов, попробуйте позже' },
      { status: 429 }
    );
  }

  const body = await req.json();

  if (body.website) {
    return NextResponse.json({ success: true });
  }

  const parsed = applicationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Ошибка валидации', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const application = await prisma.application.create({
      data: parsed.data,
      include: { course: true },
    });

    notifyNewApplication({
      name: application.name,
      phone: application.phone,
      telegram: application.telegram,
      courseTitle: application.course?.title,
      format: application.format ?? undefined,
      preferredTime: application.preferredTime,
      comment: application.comment,
    }).catch((err) => console.error('Telegram notify failed:', err));

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Не удалось отправить заявку' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(applications);
}