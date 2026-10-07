import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ApplicationForm } from '@/components/ApplicationForm';

type ProgramModule = { title: string; items?: string[] };
type FaqItem = { question: string; answer: string };

import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) return {};

  return {
    title: course.title,
    description: course.shortDescription ?? `Курс «${course.title}» в Legal Skills Academy`,
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      groups: { where: { status: { not: 'FINISHED' } }, orderBy: { startDate: 'asc' } },
      teachers: { include: { teacher: true } },
      reviews: { where: { isPublished: true }, orderBy: { createdAt: 'desc' } },
    },
  });

  if (!course || !course.isPublished) notFound();

  const program = (course.program as ProgramModule[] | null) ?? [];
  const faq = (course.faq as FaqItem[] | null) ?? [];

  const formatLabel: Record<string, string> = {
    ONLINE: 'Онлайн',
    OFFLINE: 'Офлайн',
    HYBRID: 'Онлайн + Офлайн',
  };

  return (
    <div>
      <section className="bg-navy-900">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h1 className="text-3xl font-semibold text-white">{course.title}</h1>
          {course.shortDescription && (
            <p className="mt-4 max-w-2xl text-white/70">{course.shortDescription}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#apply" className="rounded-md bg-gold-500 px-5 py-2.5 text-sm font-medium text-navy-900 hover:bg-gold-600">
              Записаться
            </a>
            <a href="https://t.me/legalskills_academy" target="_blank" className="rounded-md border border-white/30 px-5 py-2.5 text-sm text-white hover:border-white">
              Написать в Telegram
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          <InfoCard label="Формат" value={formatLabel[course.format]} />
          <InfoCard label="Длительность" value={course.duration ?? '—'} />
          <InfoCard label="Академических часов" value={course.academicHours ? String(course.academicHours) : '—'} />
          <InfoCard
            label="Стоимость"
            value={course.price ? `${Number(course.price).toLocaleString('ru-RU')} сум` : 'По запросу'}
          />
        </div>

        {course.targetAudience && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-navy-900">Для кого курс</h2>
            <p className="mt-2 text-navy-700">{course.targetAudience}</p>
          </div>
        )}

        {course.goals && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-navy-900">Цели и результаты обучения</h2>
            <p className="mt-2 text-navy-700">{course.goals}</p>
          </div>
        )}

        {program.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-navy-900">Программа курса</h2>
            <div className="mt-4 space-y-4">
              {program.map((module, i) => (
                <div key={i} className="rounded-lg border border-navy-900/10 p-4">
                  <p className="font-medium text-navy-900">{module.title}</p>
                  {module.items && module.items.length > 0 && (
                    <ul className="mt-2 list-inside list-disc text-sm text-navy-700/80">
                      {module.items.map((item, j) => <li key={j}>{item}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {course.groups.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-navy-900">Ближайшие группы</h2>
            <div className="mt-4 space-y-3">
              {course.groups.map((group) => (
                <div key={group.id} className="flex items-center justify-between rounded-lg bg-cloud p-4">
                  <div>
                    <p className="font-medium text-navy-900">
                      Старт {new Date(group.startDate).toLocaleDateString('ru-RU')}
                    </p>
                    <p className="text-sm text-navy-700/70">{group.daysOfWeek}, {group.time}</p>
                  </div>
                  <a href="#apply" className="rounded-md bg-gold-500 px-4 py-2 text-sm font-medium text-navy-900 hover:bg-gold-600">
                    Записаться
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {course.teachers.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-navy-900">Преподаватели</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {course.teachers.map(({ teacher }) => (
                <div key={teacher.id} className="text-center">
                  {teacher.photoUrl ? (
                    <img src={teacher.photoUrl} alt={teacher.fullName} className="aspect-square w-full rounded-lg object-cover" />
                  ) : (
                    <div className="aspect-square rounded-lg bg-cloud" />
                  )}
                  <p className="mt-2 text-sm font-medium text-navy-900">{teacher.fullName}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {course.certificateInfo && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-navy-900">Документ по окончании</h2>
            <p className="mt-2 text-navy-700">{course.certificateInfo}</p>
          </div>
        )}

        {faq.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-navy-900">Частые вопросы</h2>
            <div className="mt-4 space-y-3">
              {faq.map((item, i) => (
                <details key={i} className="rounded-lg border border-navy-900/10 p-4">
                  <summary className="cursor-pointer font-medium text-navy-900">{item.question}</summary>
                  <p className="mt-2 text-sm text-navy-700/80">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {course.reviews.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-navy-900">Отзывы</h2>
            <div className="mt-4 space-y-4">
              {course.reviews.map((review) => (
                <div key={review.id} className="rounded-lg bg-cloud p-4">
                  <p className="font-medium text-navy-900">{review.authorName}</p>
                  <p className="mt-1 text-sm text-navy-700/80">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div id="apply" className="mt-14 rounded-lg bg-cloud p-6">
          <h2 className="text-lg font-semibold text-navy-900">Записаться на курс</h2>
          <div className="mt-4">
            <ApplicationForm defaultCourseId={course.id} />
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-navy-900/10 p-4">
      <p className="text-xs text-navy-700/60">{label}</p>
      <p className="mt-1 font-medium text-navy-900">{value}</p>
    </div>
  );
}