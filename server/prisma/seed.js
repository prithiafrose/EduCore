require("dotenv").config();
const prisma = require("../src/config/prisma");
const { hashPassword } = require("../src/utils/hash");
const { validateEmail } = require("../src/utils/email");

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@educore.edu";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@123";

  const adminEmailError = validateEmail(adminEmail);

  if (adminEmailError) {
    throw new Error(`Invalid SEED_ADMIN_EMAIL: ${adminEmailError}`);
  }

  if (!adminPassword || adminPassword.length < 6) {
    throw new Error("SEED_ADMIN_PASSWORD must be at least 6 characters");
  }

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
      role: "ADMIN",
    },
  });
  console.log(`Admin user ready: ${admin.email} (role: ${admin.role})`);

  const department = await prisma.department.upsert({
    where: { code: "CSE" },
    update: {},
    create: { name: "Computer Science & Engineering", code: "CSE" },
  });
  console.log(`Department ready: ${department.name}`);

  const program = await prisma.program.upsert({
    where: { code: "BSC-CSE" },
    update: {},
    create: { name: "B.Sc. in Computer Science & Engineering", code: "BSC-CSE", departmentId: department.id },
  });
  console.log(`Program ready: ${program.name}`);

  const academicSemester = await prisma.academicSemester.upsert({
    where: { programId_order: { programId: program.id, order: 1 } },
    update: {},
    create: { name: "Semester 1", order: 1, programId: program.id },
  });
  console.log(`Academic semester ready: ${academicSemester.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });