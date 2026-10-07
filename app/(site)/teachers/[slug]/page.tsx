import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { BannerPage } from "@/components/BannerPage";
import Link from "next/link";

const ROLE_LABELS: Record<string, string> = {
  TEACHER: 'Преподаватель',
  DIRECTOR: 'Руководство',
  METHODIST: 'Методист',
  STAFF: 'Сотрудник',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const teacher = await prisma.teacher.findUnique({ where: { slug } });
  if (!teacher) return {};

  return {
    title: teacher.fullName,
    description: `${teacher.position} в Legal Skills Academy`,
  };
}

export default async function TeacherPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const teacher = await prisma.teacher.findUnique({
    where: { slug },
    include: {
      courses: { include: { course: true } },
      reviews: { where: { isPublished: true } },
    },
  });

  if (!teacher || !teacher.isPublished) notFound();

  const achievements = (teacher.achievements as string[] | null) ?? [];

  return (
    <div>
      <BannerPage title={teacher.fullName} subtitle={`${ROLE_LABELS[teacher.role]} · ${teacher.position}`} />

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[200px_1fr]">
          {teacher.photoUrl ? (
            <img src={teacher.photoUrl} alt={teacher.fullName} className="aspect-square w-full rounded-lg object-cover" />
          ) : (
            <div className="aspect-square rounded-lg bg-cloud" />
          )}

          <div className="space-y-6">
            {teacher.bio && (
              <div>
                <h2 className="text-lg font-semibold text-navy-900">О преподавателе</h2>
                <p className="mt-2 text-navy-700">{teacher.bio}</p>
              </div>
            )}

            {teacher.education && (
              <div>
                <h2 className="text-lg font-semibold text-navy-900">Образование</h2>
                <p className="mt-2 text-navy-700">{teacher.education}</p>
              </div>
            )}

            {teacher.experience && (
              <div>
                <h2 className="text-lg font-semibold text-navy-900">Опыт работы</h2>
                <p className="mt-2 text-navy-700">{teacher.experience}</p>
              </div>
            )}

            {achievements.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-navy-900">Сертификаты и достижения</h2>
                <ul className="mt-2 list-inside list-disc text-navy-700">
                  {achievements.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}

            {teacher.courses.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-navy-900">Ведёт курсы</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {teacher.courses.map(({ course }) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="rounded-full border border-navy-900/10 px-3 py-1 text-sm text-navy-900 hover:border-gold-500"
                    >
                      {course.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}