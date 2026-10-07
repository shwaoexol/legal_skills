import { prisma } from "@/lib/db";
import { BannerPage } from "@/components/BannerPage";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Расписание",
  description: "Расписание групп и ближайшие даты старта курсов Legal Skills Academy.",
};

export default async function SchedulePage() {
  const groups = await prisma.group.findMany({
    include: { course: true },
    orderBy: { startDate: 'asc' },
  });

  return (
    <div>
      <BannerPage
        title="Расписание занятий"
        subtitle="Актуальные группы и ближайшие даты старта"
      />

      <section className="mx-auto max-w-6xl px-6 py-10">
        {groups.length === 0 ? (
          <p className="text-navy-700/60">Наборы пока не объявлены.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-navy-900/10">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-cloud text-navy-700/70">
                <tr>
                  <th className="px-4 py-3">Курс</th>
                  <th className="px-4 py-3">Дата старта</th>
                  <th className="px-4 py-3">Дни / время</th>
                  <th className="px-4 py-3">Мест всего</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group.id} className="border-t border-navy-900/5">
                    <td className="px-4 py-3 font-medium text-navy-900">{group.course.title}</td>
                    <td className="px-4 py-3 text-navy-700">
                      {new Date(group.startDate).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-4 py-3 text-navy-700">{group.daysOfWeek}, {group.time}</td>
                    <td className="px-4 py-3 text-navy-700">{group.seatsTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}