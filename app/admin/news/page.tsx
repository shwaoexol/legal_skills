import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function createNews(formData: FormData) {
  'use server';
  await prisma.newsPost.create({
    data: {
      slug: formData.get('slug') as string,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      publishedAt: new Date(),
    },
  });
  revalidatePath('/admin/news');
}

async function deleteNews(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.newsPost.delete({ where: { id } });
  revalidatePath('/admin/news');
}

export default async function AdminNewsPage() {
  const news = await prisma.newsPost.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-xl font-semibold">Новости</h1>

      <form action={createNews} className="mt-6 space-y-3 rounded border p-4">
        <input name="slug" placeholder="slug" required className="block w-full rounded border p-2" />
        <input name="title" placeholder="Заголовок" required className="block w-full rounded border p-2" />
        <textarea name="content" placeholder="Текст" required className="block w-full rounded border p-2" />
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">Опубликовать</button>
      </form>

      <table className="mt-8 w-full text-left text-sm">
        <tbody>
          {news.map((n) => (
            <tr key={n.id} className="border-t">
              <td className="py-2">{n.title}</td>
              <td className="py-2">
                <form action={deleteNews}>
                  <input type="hidden" name="id" value={n.id} />
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