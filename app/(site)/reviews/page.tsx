import { prisma } from '@/lib/db';

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-navy-900">Отзывы</h1>

      <div className="mt-8 space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg border border-navy-900/10 p-4">
            <p className="text-navy-700">«{review.text}»</p>
            <p className="mt-2 text-sm font-medium text-navy-900">{review.authorName}</p>
          </div>
        ))}
      </div>
    </section>
  );
}