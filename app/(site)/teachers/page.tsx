import { prisma } from "@/lib/db";
import { BannerPage } from "@/components/BannerPage";

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
              <div key={teacher.id}>
                {teacher.photoUrl ? (
                  <img
                    src={teacher.photoUrl}
                    alt={teacher.fullName}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="aspect-square rounded-lg bg-cloud" />
                )}
                <p className="mt-2 text-sm font-medium text-navy-900">{teacher.fullName}</p>
                <p className="text-xs text-navy-700/60">{teacher.position}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}