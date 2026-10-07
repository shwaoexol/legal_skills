import { z } from 'zod';

export const applicationSchema = z.object({
  name: z.string().min(2, 'Укажите имя'),
  phone: z.string().min(6, 'Некорректный телефон'),
  telegram: z.string().optional(),
  courseId: z.string().nullable().optional(),
  format: z.enum(['ONLINE', 'OFFLINE', 'HYBRID']).optional(),
  preferredTime: z.string().optional(),
  comment: z.string().optional(),
  consentPersonalData: z.boolean().refine((v) => v === true, {
    message: 'Нужно согласие на обработку персональных данных',
  }),
});

export const teacherSchema = z.object({
  slug: z.string().min(2),
  fullName: z.string().min(2, 'Укажите ФИО'),
  position: z.string().min(2, 'Укажите позицию'),
  role: z.enum(['TEACHER', 'DIRECTOR', 'METHODIST', 'STAFF']),
  bio: z.string().optional(),
});