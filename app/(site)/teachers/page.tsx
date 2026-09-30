import { prisma } from "@/lib/db";


export default async function TeachersPage(){
    const teachers = await prisma.teacher.findMany({
        where: { isPublished: true },
        orderBy: { fullName: 'asc' },
    });

    return (
        <section className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="text-2xl font-semibold text-navy-900">Наши преподаватели</h1>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                {teachers.map((teacher) => (
                    <div key={teacher.id} className="rounded-lg border border-navy-900/10 p-4">
                        <p className="font-medium text-navy-700/70">{teacher.fullName}</p>
                        <p className="mt-1 text-sm text-navy-700/70">{teacher.position}</p>
                    </div>
                ))}
            </div>
        </section>        
    )
}