/*
  Warnings:

  - You are about to drop the column `transactionId` on the `StudentPayment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,courseOfferingId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,feeId]` on the table `StudentPayment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "StudentPayment_transactionId_key";

-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "assignmentId" INTEGER;

-- AlterTable
ALTER TABLE "StudentPayment" DROP COLUMN "transactionId";

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_studentId_courseOfferingId_key" ON "Enrollment"("studentId", "courseOfferingId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentPayment_studentId_feeId_key" ON "StudentPayment"("studentId", "feeId");

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
