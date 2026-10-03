import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { saveUploadedFile } from '@/lib/upload'; 

async function createTeacher(formData: FormData) {
  'use server';
  const photoUrl = await saveUploadedFile(formData.get('photo') as File); 

  await prisma.teacher.create({
    data: {
      slug: formData.get('slug') as string,
      fullName: formData.get('fullName') as string,
      position: formData.get('position') as string,
      role: formData.get('role') as 'TEACHER' | 'DIRECTOR' | 'METHODIST' | 'STAFF',
      photoUrl: photoUrl ?? undefined, 
    },
  });
  revalidatePath('/admin/teachers');
}

async function deleteTeacher(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.teacher.delete({ where: { id } });
  revalidatePath('/admin/teachers');
}

export default async function AdminTeachersPage() {
  const teachers = await prisma.teacher.findMany({ orderBy: { fullName: 'asc' } });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-xl font-semibold">Преподаватели</h1>

      <form action={createTeacher} className="mt-6 space-y-3 rounded border p-4">
        <input name="slug" placeholder="slug" required className="block w-full rounded border p-2" />
        <input name="fullName" placeholder="ФИО" required className="block w-full rounded border p-2" />
        <input name="position" placeholder="Должность" required className="block w-full rounded border p-2" />
        <select name="role" className="block w-full rounded border p-2">
          <option value="TEACHER">Преподаватель</option>
          <option value="DIRECTOR">Руководство</option>
          <option value="METHODIST">Методист</option>
          <option value="STAFF">Сотрудник</option>
        </select>
        <input type="file" name="photo" accept="image/*" className="block w-full rounded border p-2" /> 
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">Добавить</button>
      </form>

      <table className="mt-8 w-full text-left text-sm">
        <tbody>
          {teachers.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="py-2"> 
                {t.photoUrl && (
                  <img src={t.photoUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                )}
              </td>
              <td className="py-2">{t.fullName}</td>
              <td className="py-2">{t.position}</td>
              <td className="py-2">
                <form action={deleteTeacher}>
                  <input type="hidden" name="id" value={t.id} />
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