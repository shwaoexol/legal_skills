import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { saveUploadedFile } from '@/lib/upload';

const TYPE_LABELS: Record<string, string> = {
  OFFER: 'Публичная оферта',
  PRIVACY_POLICY: 'Политика персональных данных',
  CONSENT: 'Согласие на обработку ПД',
  REQUISITES: 'Реквизиты организации',
  OTHER: 'Другое',
};

async function createDocument(formData: FormData) {
  'use server';
  const fileUrl = await saveUploadedFile(formData.get('file') as File);
  if (!fileUrl) return;

  await prisma.legalDocument.create({
    data: {
      type: formData.get('type') as 'OFFER' | 'PRIVACY_POLICY' | 'CONSENT' | 'REQUISITES' | 'OTHER',
      title: formData.get('title') as string,
      version: formData.get('version') as string,
      fileUrl,
    },
  });
  revalidatePath('/admin/documents');
  revalidatePath('/documents');
}

async function deleteDocument(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.legalDocument.delete({ where: { id } });
  revalidatePath('/admin/documents');
  revalidatePath('/documents');
}

export default async function AdminDocumentsPage() {
  const documents = await prisma.legalDocument.findMany({ orderBy: { publishedAt: 'desc' } });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-xl font-semibold">Документы</h1>

      <form action={createDocument} className="mt-6 space-y-3 rounded border p-4">
        <select name="type" className="block w-full rounded border p-2">
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <input name="title" placeholder="Название документа" required className="block w-full rounded border p-2" />
        <input name="version" placeholder="Версия (например, 1.0)" required className="block w-full rounded border p-2" />
        <input type="file" name="file" accept=".pdf,application/pdf" required className="block w-full rounded border p-2" />
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">Загрузить</button>
      </form>

      <table className="mt-8 w-full text-left text-sm">
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-t">
              <td className="py-2">{TYPE_LABELS[doc.type]}</td>
              <td className="py-2">{doc.title}</td>
              <td className="py-2">v{doc.version}</td>
              <td className="py-2">
                <a href={doc.fileUrl} target="_blank" className="text-blue-600 hover:underline">Открыть</a>
              </td>
              <td className="py-2">
                <form action={deleteDocument}>
                  <input type="hidden" name="id" value={doc.id} />
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