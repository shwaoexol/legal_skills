import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.authorName || !body.text) {
    return NextResponse.json({ error: 'Заполните имя и текст отзыва' }, { status: 400 });
  }

  try {
    const review = await prisma.review.create({
      data: {
        authorName: body.authorName,
        text: body.text,
        // isPublished не указываем — сработает @default(false) из схемы
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Не удалось отправить отзыв' }, { status: 500 });
  }
}