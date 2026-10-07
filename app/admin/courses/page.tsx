import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { saveUploadedFile } from '@/lib/upload';


function parseJson(value: FormDataEntryValue | null) {
  const text = (value as string | null)?.trim();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

async function createCourse(formData: FormData) {
  'use server';
  const imageUrl = await saveUploadedFile(formData.get('photo') as File);

  const programRaw = formData.get('program') as string;
  const faqRaw = formData.get('faq') as string;

  let program: unknown = [];
  let faq: unknown = null;
  try {
    program = programRaw ? JSON.parse(programRaw) : [];
  } catch {
    program = [];
  }
  try {
    faq = faqRaw ? JSON.parse(faqRaw) : null;
  } catch {
    faq = null;
  }

  const priceRaw = formData.get('price') as string;
  const hoursRaw = formData.get('academicHours') as string;

  await prisma.course.create({
    data: {
      slug: formData.get('slug') as string,
      title: formData.get('title') as string,
      format: formData.get('format') as 'ONLINE' | 'OFFLINE' | 'HYBRID',
      shortDescription: (formData.get('shortDescription') as string) || undefined,
      targetAudience: (formData.get('targetAudience') as string) || undefined,
      goals: (formData.get('goals') as string) || undefined,
      duration: (formData.get('duration') as string) || undefined,
      academicHours: hoursRaw ? Number(hoursRaw) : undefined,
      price: priceRaw ? Number(priceRaw) : undefined,
      certificateInfo: (formData.get('certificateInfo') as string) || undefined,
      program: parseJson(formData.get('program')) as never,
      faq: faq ?? undefined,
      imageUrl: imageUrl ?? undefined,
    },
  });
  revalidatePath('/admin/courses');
  revalidatePath('/');
  revalidatePath('/courses');
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
        <textarea name="shortDescription" placeholder="Краткое описание" rows={2} className="block w-full rounded border p-2" />

        <select name="format" className="block w-full rounded border p-2">
          <option value="ONLINE">Онлайн</option>
          <option value="OFFLINE">Офлайн</option>
          <option value="HYBRID">Онлайн + Офлайн</option>
        </select>

        <input name="targetAudience" placeholder="Для кого курс" className="block w-full rounded border p-2" />
        <textarea name="goals" placeholder="Цели и результаты обучения" rows={2} className="block w-full rounded border p-2" />
        <input name="duration" placeholder="Длительность (например, 3 месяца)" className="block w-full rounded border p-2" />
        <input name="academicHours" type="number" placeholder="Академических часов" className="block w-full rounded border p-2" />
        <input name="price" type="number" placeholder="Стоимость (сум)" className="block w-full rounded border p-2" />
        <input name="certificateInfo" placeholder="Документ по окончании" className="block w-full rounded border p-2" />

        <div>
          <label className="mb-1 block text-xs text-gray-600">
            Программа курса (JSON-формат — пример ниже)
          </label>
          <textarea
            name="program"
            rows={4}
            placeholder={'[{"title":"Модуль 1: Введение","items":["Тема 1","Тема 2"]}]'}
            className="block w-full rounded border p-2 font-mono text-xs"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-600">
            FAQ (JSON-формат — пример ниже)
          </label>
          <textarea
            name="faq"
            rows={3}
            placeholder={'[{"question":"Сколько длится курс?","answer":"3 месяца"}]'}
            className="block w-full rounded border p-2 font-mono text-xs"
          />
        </div>

        <input type="file" name="photo" accept="image/*" className="block w-full rounded border p-2" />
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">Добавить курс</button>
      </form>

      <table className="mt-8 w-full text-left text-sm">
        <tbody>
          {courses.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="py-2">
                {c.imageUrl && (
                  <img src={c.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
                )}
              </td>
              <td className="py-2">{c.title}</td>
              <td className="py-2">{c.format}</td>
              <td className="py-2">{c.price ? `${Number(c.price).toLocaleString('ru-RU')} сум` : '—'}</td>
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