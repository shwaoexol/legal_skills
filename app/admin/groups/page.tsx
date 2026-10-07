import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const STATUS_LABELS: Record<string, string> = {
  RECRUITING: 'Идёт набор',
  FEW_SEATS: 'Места заканчиваются',
  FULL: 'Группа заполнена',
  IN_PROGRESS: 'Обучение идёт',
  FINISHED: 'Набор завершён',
};

async function createGroup(formData: FormData) {
  'use server';
  const teacherId = formData.get('teacherId') as string;
  const priceRaw = formData.get('price') as string;

  await prisma.group.create({
    data: {
      courseId: formData.get('courseId') as string,
      teacherId: teacherId || undefined,
      startDate: new Date(formData.get('startDate') as string),
      daysOfWeek: formData.get('daysOfWeek') as string,
      time: formData.get('time') as string,
      format: formData.get('format') as 'ONLINE' | 'OFFLINE' | 'HYBRID',
      location: (formData.get('location') as string) || undefined,
      seatsTotal: Number(formData.get('seatsTotal')),
      price: priceRaw ? Number(priceRaw) : undefined,
      status: formData.get('status') as 'RECRUITING' | 'FEW_SEATS' | 'FULL' | 'IN_PROGRESS' | 'FINISHED',
    },
  });
  revalidatePath('/admin/groups');
  revalidatePath('/');
  revalidatePath('/schedule');
}

async function deleteGroup(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.group.delete({ where: { id } });
  revalidatePath('/admin/groups');
}

export default async function AdminGroupsPage() {
  const [groups, courses, teachers] = await Promise.all([
    prisma.group.findMany({ include: { course: true, teacher: true }, orderBy: { startDate: 'asc' } }),
    prisma.course.findMany(),
    prisma.teacher.findMany({ orderBy: { fullName: 'asc' } }),
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

        <select name="teacherId" className="block w-full rounded border p-2">
          <option value="">Преподаватель (необязательно)</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>{t.fullName}</option>
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

        <input name="location" placeholder="Аудитория или ссылка на онлайн-встречу" className="block w-full rounded border p-2" />
        <input type="number" name="seatsTotal" placeholder="Мест всего" required className="block w-full rounded border p-2" />
        <input type="number" name="price" placeholder="Цена (сум)" className="block w-full rounded border p-2" />

        <select name="status" className="block w-full rounded border p-2">
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <button type="submit" className="rounded bg-black px-4 py-2 text-white">Добавить группу</button>
      </form>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="text-xs text-gray-500">
            <th className="py-2 text-left">Курс</th>
            <th className="py-2 text-left">Старт</th>
            <th className="py-2 text-left">Преподаватель</th>
            <th className="py-2 text-left">Статус</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr key={g.id} className="border-t">
              <td className="py-2">{g.course.title}</td>
              <td className="py-2">{new Date(g.startDate).toLocaleDateString('ru-RU')}</td>
              <td className="py-2">{g.teacher?.fullName ?? '—'}</td>
              <td className="py-2">{STATUS_LABELS[g.status]}</td>
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