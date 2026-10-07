import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Новая',
  CONTACTED: 'Связались',
  ENROLLED: 'Записан',
  REJECTED: 'Отклонена',
};

async function updateStatus(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const status = formData.get('status') as string;
  await prisma.application.update({ where: { id }, data: { status: status as never } });
  revalidatePath('/admin/applications');
}

async function deleteApplication(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.application.delete({ where: { id } });
  revalidatePath('/admin/applications');
}

export default async function AdminApplicationsPage() {
  const applications = await prisma.application.findMany({
    include: { course: true, group: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Заявки ({applications.length})</h1>
        <div className="flex gap-2">
          <a href="/api/applications/export-csv" className="rounded bg-gray-700 px-4 py-2 text-sm text-white">
            CSV
          </a>
          <a href="/api/applications/export-excel" className="rounded bg-black px-4 py-2 text-sm text-white">
            Excel (.xlsx)
          </a>
        </div>
      </div>

      <table className="mt-6 w-full text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2">Имя</th>
            <th className="px-3 py-2">Телефон</th>
            <th className="px-3 py-2">Telegram</th>
            <th className="px-3 py-2">Курс</th>
            <th className="px-3 py-2">Формат</th>
            <th className="px-3 py-2">Комментарий</th>
            <th className="px-3 py-2">Дата</th>
            <th className="px-3 py-2">Статус</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-t align-top">
              <td className="px-3 py-2">{app.name}</td>
              <td className="px-3 py-2">
                <a href={`tel:${app.phone}`} className="hover:underline">{app.phone}</a>
              </td>
              <td className="px-3 py-2">{app.telegram ?? '—'}</td>
              <td className="px-3 py-2">{app.course?.title ?? '—'}</td>
              <td className="px-3 py-2">{app.format ?? '—'}</td>
              <td className="px-3 py-2 max-w-[200px] truncate">{app.comment ?? '—'}</td>
              <td className="px-3 py-2">{new Date(app.createdAt).toLocaleString('ru-RU')}</td>
              <td className="px-3 py-2">
                <form action={updateStatus} className="flex items-center gap-1">
                    <input type="hidden" name="id" value={app.id} />
                    <select name="status" defaultValue={app.status} className="rounded border p-1 text-xs">
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                    </select>
                    <button type="submit" className="rounded bg-gray-200 px-2 py-1 text-xs">OK</button>
                </form>
            </td>
              <td className="px-3 py-2">
                <form action={deleteApplication}>
                  <input type="hidden" name="id" value={app.id} />
                  <button type="submit" className="text-red-600 hover:underline">Удалить</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {applications.length === 0 && (
        <p className="mt-6 text-gray-500">Заявок пока нет.</p>
      )}
    </div>
  );
}