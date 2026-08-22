BEGIN;

-- Create AssessmentActivity only if it does not exist
CREATE TABLE IF NOT EXISTS "AssessmentActivity" (
    "id" SERIAL NOT NULL,
    "assessmentId" INTEGER NOT NULL,
    "assignmentId" INTEGER,
    "name" TEXT NOT NULL,
    "maxMarks" DECIMAL(65,30) NOT NULL,
    "activityDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentActivity_pkey" PRIMARY KEY ("id")
);

-- Unique activity name within an assessment
CREATE UNIQUE INDEX IF NOT EXISTS "AssessmentActivity_assessmentId_name_key"
ON "AssessmentActivity"("assessmentId", "name");

-- StudentMark unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS "StudentMark_assessmentActivityId_enrollmentId_key"
ON "StudentMark"("assessmentActivityId", "enrollmentId");

-- AssessmentActivity -> Assessment
ALTER TABLE "AssessmentActivity"
DROP CONSTRAINT IF EXISTS "AssessmentActivity_assessmentId_fkey";

ALTER TABLE "AssessmentActivity"
ADD CONSTRAINT "AssessmentActivity_assessmentId_fkey"
FOREIGN KEY ("assessmentId")
REFERENCES "Assessment"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AssessmentActivity -> Assignment
ALTER TABLE "AssessmentActivity"
DROP CONSTRAINT IF EXISTS "AssessmentActivity_assignmentId_fkey";

ALTER TABLE "AssessmentActivity"
ADD CONSTRAINT "AssessmentActivity_assignmentId_fkey"
FOREIGN KEY ("assignmentId")
REFERENCES "Assignment"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- StudentMark -> AssessmentActivity
ALTER TABLE "StudentMark"
DROP CONSTRAINT IF EXISTS "StudentMark_assessmentActivityId_fkey";

ALTER TABLE "StudentMark"
ADD CONSTRAINT "StudentMark_assessmentActivityId_fkey"
FOREIGN KEY ("assessmentActivityId")
REFERENCES "AssessmentActivity"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

COMMIT;