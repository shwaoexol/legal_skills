import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ApplicationForm } from '@/components/ApplicationForm';
import { CourseCatalogCard } from '@/components/CourseCatalogCard';

const ADVANTAGES = [
  { title: 'Авторские методики', text: 'Программы разработаны практикующими экспертами, а не скопированы из учебников' },
  { title: 'Практическая направленность', text: 'Минимум теории ради теории — упор на реальные кейсы и навыки' },
  { title: 'Опытные преподаватели', text: 'Ведут практикующие юристы, бухгалтеры, HR- и English-специалисты' },
  { title: 'Профильное образование', text: 'По итогам курса — документ, подтверждающий полученные знания' },
];

const FORMATS = [
  { label: 'Online', text: 'Учитесь из любой точки — занятия проходят в прямом эфире с обратной связью' },
  { label: 'Offline', text: 'Занятия очно в учебном центре, живое общение с преподавателем и группой' },
  { label: 'Online + Offline', text: 'Гибридный формат — сочетайте удобство онлайна с очной практикой' },
];

export default async function HomePage() {
  const [courses, groups, teachers, reviews] = await Promise.all([
    prisma.course.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' }, take: 9 }),
    prisma.group.findMany({
      include: { course: true },
      orderBy: { startDate: 'asc' },
      take: 4,
    }),
    prisma.teacher.findMany({ where: { isPublished: true }, orderBy: { fullName: 'asc' }, take: 4 }),
    prisma.review.findMany({ where: { isPublished: true }, orderBy: { createdAt: 'desc' }, take: 4 }),
  ]);

  return (
    <div>
      <section className="bg-navy-900">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h1 className="max-w-xl text-3xl font-semibold text-white">
            Образование, которое открывает новые возможности
          </h1>
          <p className="mt-4 max-w-lg text-white/70">
            9 направлений обучения для вашего профессионального и личностного роста
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/courses" className="rounded-md bg-gold-500 px-5 py-2.5 text-sm font-medium text-navy-900 hover:bg-gold-600">
              Выбрать курс
            </Link>
            <Link href="#apply" className="rounded-md border border-white/30 px-5 py-2.5 text-sm text-white hover:border-white">
              Оставить заявку
            </Link>
            <a
              href="https://t.me/legalskills_academy"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/30 px-5 py-2.5 text-sm text-white hover:border-white"
            >
              Написать в Telegram
            </a>
            <a
              href="tel:+998778210877"
              className="rounded-md border border-white/30 px-5 py-2.5 text-sm text-white hover:border-white"
            >
              Позвонить
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-6 text-xl font-semibold text-navy-900">9 направлений обучения</h2>
        {courses.length === 0 ? (
          <p className="text-navy-700/60">Курсы пока не добавлены.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {courses.map((course) => (
              <CourseCatalogCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-cloud">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="mb-6 text-xl font-semibold text-navy-900">Ближайшие наборы</h2>
          {groups.length === 0 ? (
            <p className="text-navy-700/60">Групп пока нет.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {groups.map((group) => (
                <div key={group.id} className="rounded-lg bg-white p-5 shadow-sm">
                  <p className="font-medium text-navy-900">{group.course.title}</p>
                  <p className="mt-1 text-sm text-navy-700/70">
                    Старт {new Date(group.startDate).toLocaleDateString('ru-RU')} · {group.daysOfWeek}, {group.time}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-6 text-xl font-semibold text-navy-900">Почему выбирают нас</h2>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          {ADVANTAGES.map((item) => (
            <div key={item.title} className="rounded-lg border border-navy-900/10 p-5">
              <p className="font-medium text-navy-900">{item.title}</p>
              <p className="mt-2 text-sm text-navy-700/70">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cloud">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="mb-6 text-xl font-semibold text-navy-900">Форматы обучения</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {FORMATS.map((format) => (
              <div key={format.label} className="rounded-lg bg-white p-5 shadow-sm">
                <p className="font-medium text-navy-900">{format.label}</p>
                <p className="mt-2 text-sm text-navy-700/70">{format.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-6 text-xl font-semibold text-navy-900">Наши преподаватели</h2>
        {teachers.length === 0 ? (
          <p className="text-navy-700/60">Пока не добавлены.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {teachers.map((teacher) => (
              <Link key={teacher.id} href={`/teachers/${teacher.slug}`}>
                {teacher.photoUrl ? (
                  <img src={teacher.photoUrl} alt={teacher.fullName} className="aspect-square w-full rounded-lg object-cover" />
                ) : (
                  <div className="aspect-square rounded-lg bg-cloud" />
                )}
                <p className="mt-2 text-sm font-medium text-navy-900">{teacher.fullName}</p>
                <p className="text-xs text-navy-700/60">{teacher.position}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {reviews.length > 0 && (
        <section className="bg-cloud">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <h2 className="mb-6 text-xl font-semibold text-navy-900">Отзывы слушателей</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-lg bg-white p-5 shadow-sm">
                  <p className="font-medium text-navy-900">{review.authorName}</p>
                  <p className="mt-2 text-sm text-navy-700/70">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="apply" className="bg-cloud">
        <div className="mx-auto max-w-lg px-6 py-14">
          <h2 className="mb-6 text-xl font-semibold text-navy-900">Оставить заявку</h2>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <ApplicationForm courses={courses.map((c) => ({ id: c.id, title: c.title }))} />
          </div>
        </div>
      </section>
    </div>
  );
}