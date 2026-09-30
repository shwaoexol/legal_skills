import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function publishReview(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.review.update({ where: { id }, data: { isPublished: true } });
  revalidatePath('/admin/reviews');
}

async function deleteReview(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.review.delete({ where: { id } });
  revalidatePath('/admin/reviews');
}

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-xl font-semibold">Отзывы</h1>
      <table className="mt-6 w-full text-left text-sm">
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="py-2">{r.authorName}</td>
              <td className="py-2 max-w-xs truncate">{r.text}</td>
              <td className="py-2">{r.isPublished ? 'Опубликован' : 'На модерации'}</td>
              <td className="py-2">
                {!r.isPublished && (
                  <form action={publishReview} className="inline">
                    <input type="hidden" name="id" value={r.id} />
                    <button type="submit" className="mr-3 text-green-600 hover:underline">Опубликовать</button>
                  </form>
                )}
                <form action={deleteReview} className="inline">
                  <input type="hidden" name="id" value={r.id} />
                  <button type="submit" className="text-red-600 hover:underline">Удалить</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}