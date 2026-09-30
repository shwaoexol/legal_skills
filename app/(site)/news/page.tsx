import { prisma } from '@/lib/db';

export default async function NewsPage() {
  const news = await prisma.newsPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-navy-900">Новости</h1>

      <div className="mt-8 space-y-4">
        {news.map((post) => (
          <div key={post.id} className="rounded-lg border border-navy-900/10 p-4">
            <p className="font-medium text-navy-900">{post.title}</p>
            <p className="mt-1 text-sm text-navy-700/70">
              {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}