import { prisma } from "@/lib/db";


export default async function SchedulePage(){
    const groups = await prisma.group.findMany({
        include: { course: true },
        orderBy: { startDate: 'asc' },
    })

    return (
        <section className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="text-2xl font-semibold text-navy-900">Расписание занятий</h1>
            <div className="mt-8 overflow-x-auto rounded-lg border border-navy-900/10">
                <table className="w-full min-w-[600px] text-left text-sm">
                    <thead className="bg-cloud text-navy-700/70">
                        <tr>
                            <th className="px-4 py-3">Курс</th>
                            <th className="px-4 py-3">Дата старта</th>
                            <th className="px-4 py-3">Дни / время</th>
                            <th className="px-4 py-3">Место</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map((group) => (
                            <tr key={group.id} className="border-t border-navy-900/5">
                                <td className="px-4 py-3 font-medium text-navy-900">{group.course.title}</td>
                                <td className="px-4 py-3 text-navy-700">
                                    {new Date(group.startDate).toLocaleDateString('ru-RU')}
                                </td>
                                <td className="px-4 py-3 text-navy-700">
                                    {group.daysOfWeek}, {group.time}
                                </td>
                                <td className="px-4 py-3 text-navy-700">{group.seatsTotal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section> 
    )
}