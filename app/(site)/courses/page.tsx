import { prisma } from "@/lib/db";
import Link from "next/link";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Курсы",
  description: "9 направлений обучения в Legal Skills Academy: право, английский язык, бухгалтерия, HR, психология.",
};


export default async function CoursesPage(){
    const courses = await prisma.course.findMany({
        where: { isPublished: true },
        orderBy: { order: 'asc' }
    });

    return (
        <section className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="text-2xl font-semibold text-navy-900">Все курсы</h1>
            <p className="mt-1 text-navy">Выберите направление, которое подходит именно вам.</p>
            {courses.length === 0 ? (
                <p className="mt-8 text-navy-700/60">Курсов пока нет.</p>
            ) : (
                <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
                    {courses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/courses/${course.slug}`}
                            className="rounded-lg border border-navy-900/10 p-4 hover:border-gold-500"
                        >
                            <p className="font-medium text-navy-900">{course.title}</p>
                            {course.shortDescription && (
                                <p className="mt-1 text-sm text-navy-700/70">{course.shortDescription}</p>
                            )}
                        </Link>
                    ))}
                </div>
            )}

        </section>
    );
}