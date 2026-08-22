const prisma = require("./src/config/prisma");

async function test() {
  const activity = await prisma.assessmentActivity.create({
    data: {
      assessmentId: 2,
      name: "Quiz 1",
      maxMarks: 5,
      activityDate: new Date(),
    },
  });

  console.log("Created AssessmentActivity:");
  console.log(activity);

  const activities = await prisma.assessmentActivity.findMany({
    include: {
      assessment: true,
      marks: true,
    },
  });

  console.log("\nAll Assessment Activities:");
  console.dir(activities, { depth: null });
}

test()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });