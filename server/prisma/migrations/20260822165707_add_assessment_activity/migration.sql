/*
  Warnings:

  - The values [CLASS_EVALUATION,FINAL,PROJECT,OTHER] on the enum `AssessmentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `assessmentDate` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `assignmentId` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `assessmentId` on the `StudentMark` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assessmentActivityId,enrollmentId]` on the table `StudentMark` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assessmentActivityId` to the `StudentMark` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AssessmentType_new" AS ENUM ('ATTENDANCE', 'MIDTERM', 'EVALUATION');
ALTER TABLE "Assessment" ALTER COLUMN "type" TYPE "AssessmentType_new" USING ("type"::text::"AssessmentType_new");
ALTER TYPE "AssessmentType" RENAME TO "AssessmentType_old";
ALTER TYPE "AssessmentType_new" RENAME TO "AssessmentType";
DROP TYPE "public"."AssessmentType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentMark" DROP CONSTRAINT "StudentMark_assessmentId_fkey";

-- DropIndex
DROP INDEX "StudentMark_assessmentId_enrollmentId_key";

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "assessmentDate",
DROP COLUMN "assignmentId";

-- AlterTable
ALTER TABLE "StudentMark" DROP COLUMN "assessmentId",
ADD COLUMN     "assessmentActivityId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "AssessmentActivity" (
    "id" SERIAL NOT NULL,
    "assessmentId" INTEGER NOT NULL,
    "assignmentId" INTEGER,
    "name" TEXT NOT NULL,
    "maxMarks" DECIMAL(65,30) NOT NULL,
    "activityDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentActivity_assessmentId_name_key" ON "AssessmentActivity"("assessmentId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "StudentMark_assessmentActivityId_enrollmentId_key" ON "StudentMark"("assessmentActivityId", "enrollmentId");

-- AddForeignKey
ALTER TABLE "StudentMark" ADD CONSTRAINT "StudentMark_assessmentActivityId_fkey" FOREIGN KEY ("assessmentActivityId") REFERENCES "AssessmentActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentActivity" ADD CONSTRAINT "AssessmentActivity_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentActivity" ADD CONSTRAINT "AssessmentActivity_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
