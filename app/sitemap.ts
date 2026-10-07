import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const [courses, teachers] = await Promise.all([
    prisma.course.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.teacher.findMany({ where: { isPublished: true }, select: { slug: true } }),
  ]);

  const staticPages = [
    '', 'courses', 'schedule', 'teachers', 'about', 'contacts', 'reviews', 'news', 'documents',
  ].map((path) => ({
    url: `${baseUrl}/${path}`,
    lastModified: new Date(),
  }));

  const coursePages = courses.map((c) => ({
    url: `${baseUrl}/courses/${c.slug}`,
    lastModified: c.updatedAt,
  }));

  const teacherPages = teachers.map((t) => ({
    url: `${baseUrl}/teachers/${t.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...coursePages, ...teacherPages];
}