/*
  Warnings:

  - Added the required column `assessmentResult` to the `CourseResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examResult` to the `CourseResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseResult" ADD COLUMN     "assessmentResult" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "examResult" DECIMAL(65,30) NOT NULL;
