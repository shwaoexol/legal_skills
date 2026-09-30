/*
  Warnings:

  - The `status` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `program` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `format` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GroupStatus" AS ENUM ('RECRUITING', 'FEW_SEATS', 'FULL', 'IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NEW', 'CONTACTED', 'ENROLLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TeacherRole" AS ENUM ('TEACHER', 'DIRECTOR', 'METHODIST', 'STAFF');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('OFFER', 'PRIVACY_POLICY', 'CONSENT', 'REQUISITES', 'OTHER');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPERADMIN', 'EDITOR');

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_courseId_fkey";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "comment" TEXT,
ADD COLUMN     "consentPersonalData" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "format" "Format",
ADD COLUMN     "groupId" TEXT,
ADD COLUMN     "preferredTime" TEXT,
ADD COLUMN     "sourceUrl" TEXT,
ADD COLUMN     "telegram" TEXT,
ADD COLUMN     "utmCampaign" TEXT,
ADD COLUMN     "utmMedium" TEXT,
ADD COLUMN     "utmSource" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "academicHours" INTEGER,
ADD COLUMN     "certificateInfo" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "faq" JSONB,
ADD COLUMN     "goals" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "price" DECIMAL(12,2),
ADD COLUMN     "priceNote" TEXT,
ADD COLUMN     "program" JSONB NOT NULL,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "targetAudience" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "format" "Format" NOT NULL,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "price" DECIMAL(12,2),
ADD COLUMN     "seatsTaken" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "GroupStatus" NOT NULL DEFAULT 'RECRUITING',
ADD COLUMN     "teacherId" TEXT;

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "TeacherRole" NOT NULL DEFAULT 'TEACHER',
    "position" TEXT NOT NULL,
    "photoUrl" TEXT,
    "education" TEXT,
    "experience" TEXT,
    "achievements" JSONB,
    "bio" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherCourse" (
    "teacherId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "TeacherCourse_pkey" PRIMARY KEY ("teacherId","courseId")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "courseId" TEXT,
    "teacherId" TEXT,
    "text" TEXT NOT NULL,
    "rating" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalDocument" (
    "id" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LegalDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'EDITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_slug_key" ON "Teacher"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "NewsPost_slug_key" ON "NewsPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "Application_status_createdAt_idx" ON "Application"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Course_isPublished_order_idx" ON "Course"("isPublished", "order");

-- CreateIndex
CREATE INDEX "Group_courseId_status_idx" ON "Group"("courseId", "status");

-- AddForeignKey
ALTER TABLE "TeacherCourse" ADD CONSTRAINT "TeacherCourse_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherCourse" ADD CONSTRAINT "TeacherCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
