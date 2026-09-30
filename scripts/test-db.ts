import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const course = await prisma.course.create({
    data: {
      slug: 'test-course',
      title: 'Тестовый курс',
      format: 'ONLINE',
      program: [],
    },
  });
  console.log('Создан курс:', course);

  const allCourses = await prisma.course.findMany();
  console.log('Все курсы в базе:', allCourses);
}

main().finally(() => prisma.$disconnect());