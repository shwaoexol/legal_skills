import Link from "next/link";

type CourseListItem = {
  id: string;
  slug: string;
  title: string;
  shortDescription?: string | null;
};

export function CourseCatalogCard({ course }: { course: CourseListItem }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="block overflow-hidden rounded-xl border border-navy-900/10 transition-colors hover:border-gold-500"
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-navy-700 to-navy-900" />
      <div className="p-4">
        <p className="text-sm font-medium leading-snug text-navy-900">{course.title}</p>
        {course.shortDescription && (
          <p className="mt-1 text-xs text-navy-700/70">{course.shortDescription}</p>
        )}
      </div>
    </Link>
  );
}