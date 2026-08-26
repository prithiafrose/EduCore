/*
  Warnings:

  - Added the required column `maxMarks` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "maxMarks" DECIMAL(65,30) NOT NULL;
