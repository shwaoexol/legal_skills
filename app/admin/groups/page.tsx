import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function createGroup(formData: FormData) {
  'use server';
  await prisma.group.create({
    data: {
      courseId: formData.get('courseId') as string,
      startDate: new Date(formData.get('startDate') as string),
      daysOfWeek: formData.get('daysOfWeek') as string,
      time: formData.get('time') as string,
      format: formData.get('format') as 'ONLINE' | 'OFFLINE' | 'HYBRID',
      seatsTotal: Number(formData.get('seatsTotal')),
    },
  });
  revalidatePath('/admin/groups');
}

async function deleteGroup(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.group.delete({ where: { id } });
  revalidatePath('/admin/groups');
}

export default async function AdminGroupsPage() {
  const [groups, courses] = await Promise.all([
    prisma.group.findMany({ include: { course: true }, orderBy: { startDate: 'asc' } }),
    prisma.course.findMany(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-xl font-semibold">Группы</h1>

      <form action={createGroup} className="mt-6 space-y-3 rounded border p-4">
        <select name="courseId" required className="block w-full rounded border p-2">
          <option value="">Выберите курс</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <input type="date" name="startDate" required className="block w-full rounded border p-2" />
        <input name="daysOfWeek" placeholder="Пн, Ср, Пт" required className="block w-full rounded border p-2" />
        <input name="time" placeholder="18:00-20:00" required className="block w-full rounded border p-2" />
        <select name="format" className="block w-full rounded border p-2">
          <option value="ONLINE">Онлайн</option>
          <option value="OFFLINE">Офлайн</option>
          <option value="HYBRID">Онлайн + Офлайн</option>
        </select>
        <input type="number" name="seatsTotal" placeholder="Мест всего" required className="block w-full rounded border p-2" />
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">Добавить группу</button>
      </form>

      <table className="mt-8 w-full text-left text-sm">
        <tbody>
          {groups.map((g) => (
            <tr key={g.id} className="border-t">
              <td className="py-2">{g.course.title}</td>
              <td className="py-2">{new Date(g.startDate).toLocaleDateString('ru-RU')}</td>
              <td className="py-2">
                <form action={deleteGroup}>
                  <input type="hidden" name="id" value={g.id} />
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