SELECT enumlabel
FROM pg_enum
WHERE enumtypid = '"AssessmentType"'::regtype
ORDER BY enumsortorder;