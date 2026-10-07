import { prisma } from "@/lib/db";
import { BannerPage } from "@/components/BannerPage";
import Link from "next/link";

const ROLE_LABELS: Record<string, string> = {
  TEACHER: 'Преподаватель',
  DIRECTOR: 'Руководство',
  METHODIST: 'Методист',
  STAFF: 'Сотрудник',
};

export default async function TeachersPage() {
  const teachers = await prisma.teacher.findMany({
    where: { isPublished: true },
    orderBy: { fullName: 'asc' },
  });

  return (
    <div>
      <BannerPage
        title="Преподаватели и эксперты"
        subtitle="Наши преподаватели — практикующие специалисты с реальным опытом и высоким уровнем экспертизы"
      />

      <section className="mx-auto max-w-6xl px-6 py-10">
        {teachers.length === 0 ? (
          <p className="text-navy-700/60">Преподаватели пока не добавлены.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {teachers.map((teacher) => (
              <Link key={teacher.id} href={`/teachers/${teacher.slug}`} className="group">
                {teacher.photoUrl ? (
                  <img
                    src={teacher.photoUrl}
                    alt={teacher.fullName}
                    className="aspect-square w-full rounded-lg object-cover transition-opacity group-hover:opacity-90"
                  />
                ) : (
                  <div className="aspect-square rounded-lg bg-cloud" />
                )}
                <p className="mt-2 text-sm font-medium text-navy-900">{teacher.fullName}</p>
                <p className="text-xs text-navy-700/60">{ROLE_LABELS[teacher.role]} · {teacher.position}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}