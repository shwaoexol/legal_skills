import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function deleteApplication(formData: FormData){
    'use server';
    const id = formData.get('id') as string;
    await prisma.application.delete({ where: { id } });
    revalidatePath('/admin')
}

export default async function AdminPage() {
    const applications = await prisma.application.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="mx-auto max-w-3xl px-6 py-12">
            <h1 className="mb-6 text-xl font-semibold">Заявки</h1>
            <table className="w-full border-collapse text-left text-sm">
                <thead>
                    <tr className="border-b">
                        <th className="py-2 px-4">Имя</th>
                        <th className="py-2 px-4">Телефон</th>
                        <th className="py-2 px-4">Датa</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((app) => (
                        <tr key={app.id} className="border-b">
                            <td className="py-2 px-4">{app.name}</td>
                            <td className="py-2 px-4">{app.phone}</td>
                            <td className="py-2 px-4">{new Date(app.createdAt).toLocaleDateString('ru-RU')}</td>
                            <td className="py-2 px-4">
                                <form action={deleteApplication}>
                                    <input type="hidden" name="id" value={app.id}/>
                                    <button type="submit" className="text-red-600 hover:underline">
                                        Удалить
                                    </button>
                                </form>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}