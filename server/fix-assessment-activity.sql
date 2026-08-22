BEGIN;

-- Create AssessmentActivity table
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

-- Unique activity name within an assessment
CREATE UNIQUE INDEX "AssessmentActivity_assessmentId_name_key"
ON "AssessmentActivity"("assessmentId", "name");

-- StudentMark currently has no data, so replace assessmentId
ALTER TABLE "StudentMark"
DROP CONSTRAINT IF EXISTS "StudentMark_assessmentId_fkey";

DROP INDEX IF EXISTS "StudentMark_assessmentId_enrollmentId_key";

ALTER TABLE "StudentMark"
DROP COLUMN "assessmentId";

ALTER TABLE "StudentMark"
ADD COLUMN "assessmentActivityId" INTEGER NOT NULL;

CREATE UNIQUE INDEX "StudentMark_assessmentActivityId_enrollmentId_key"
ON "StudentMark"("assessmentActivityId", "enrollmentId");

-- AssessmentActivity -> Assessment
ALTER TABLE "AssessmentActivity"
ADD CONSTRAINT "AssessmentActivity_assessmentId_fkey"
FOREIGN KEY ("assessmentId")
REFERENCES "Assessment"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AssessmentActivity -> Assignment
ALTER TABLE "AssessmentActivity"
ADD CONSTRAINT "AssessmentActivity_assignmentId_fkey"
FOREIGN KEY ("assignmentId")
REFERENCES "Assignment"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- StudentMark -> AssessmentActivity
ALTER TABLE "StudentMark"
ADD CONSTRAINT "StudentMark_assessmentActivityId_fkey"
FOREIGN KEY ("assessmentActivityId")
REFERENCES "AssessmentActivity"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

COMMIT;