-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('A_PLUS', 'A', 'A_MINUS', 'B_PLUS', 'B', 'B_MINUS', 'C_PLUS', 'C', 'C_MINUS', 'F');

-- CreateTable
CREATE TABLE "CourseResult" (
    "id" SERIAL NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "totalMarks" DECIMAL(65,30) NOT NULL,
    "grade" "Grade" NOT NULL,
    "gradePoint" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseResult_enrollmentId_key" ON "CourseResult"("enrollmentId");

-- AddForeignKey
ALTER TABLE "CourseResult" ADD CONSTRAINT "CourseResult_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
