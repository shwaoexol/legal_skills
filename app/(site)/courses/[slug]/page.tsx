import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
  });

  if (!course) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-navy-900">{course.title}</h1>
      {course.shortDescription && (
        <p className="mt-3 text-navy-700">{course.shortDescription}</p>
      )}
    </section>
  );
}