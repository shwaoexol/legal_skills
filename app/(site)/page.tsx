import { prisma } from "@/lib/db";
import { ApplicationForm } from "@/components/ApplicationForm";


export default async function HomePage() {
  const courses = await prisma.course.findMany();

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold">Legal Skills Academy</h1>
      <h2 className="mt-6 mb-3 text-lg font-medium">Наши курсы</h2>
      <ul className="space-y-2">
        {courses.map((course) => (
          <li key={course.id} className="rounded-md border p-3">
            {course.title}
            </li>
        ))}
      </ul>
      <h2 className="mt-10 mb-3 text-lg font-medium">Оставить заявку</h2>
      <ApplicationForm />
    </main>
  )
}