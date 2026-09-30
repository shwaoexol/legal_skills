import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function createCourse(formData: FormData) {
  'use server';
  await prisma.course.create({
    data: {
      slug: formData.get('slug') as string,
      title: formData.get('title') as string,
      format: formData.get('format') as 'ONLINE' | 'OFFLINE' | 'HYBRID',
      program: [],
    },
  });
  revalidatePath('/admin/courses');
}

async function deleteCourse(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.course.delete({ where: { id } });
  revalidatePath('/admin/courses');
}

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({ orderBy: { title: 'asc' } });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-xl font-semibold">Курсы</h1>

      <form action={createCourse} className="mt-6 space-y-3 rounded border p-4">
        <input name="slug" placeholder="slug (например, accounting)" required className="block w-full rounded border p-2" />
        <input name="title" placeholder="Название" required className="block w-full rounded border p-2" />
        <select name="format" className="block w-full rounded border p-2">
          <option value="ONLINE">Онлайн</option>
          <option value="OFFLINE">Офлайн</option>
          <option value="HYBRID">Онлайн + Офлайн</option>
        </select>
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">Добавить курс</button>
      </form>

      <table className="mt-8 w-full text-left text-sm">
        <tbody>
          {courses.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="py-2">{c.title}</td>
              <td className="py-2">{c.format}</td>
              <td className="py-2">
                <form action={deleteCourse}>
                  <input type="hidden" name="id" value={c.id} />
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