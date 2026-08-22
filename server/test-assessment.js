const prisma = require("./src/config/prisma");

async function test() {
  const assessments = await prisma.assessment.findMany({
    orderBy: {
      id: "asc",
    },
  });

  console.log(assessments);

  await prisma.$disconnect();
}

test();