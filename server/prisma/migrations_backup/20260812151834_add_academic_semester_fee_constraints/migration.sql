/*
  Warnings:

  - A unique constraint covering the columns `[programId,order]` on the table `AcademicSemester` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[programId,academicSemesterId,type]` on the table `Fee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AcademicSemester_programId_order_key" ON "AcademicSemester"("programId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Fee_programId_academicSemesterId_type_key" ON "Fee"("programId", "academicSemesterId", "type");
