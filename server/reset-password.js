const prisma = require("./src/config/prisma");
const { hashPassword } = require("./src/utils/hash");

async function resetPassword() {
    const email = "admin@educore.com";
    const newPassword = "Admin123";

    const passwordHash = await hashPassword(newPassword);

    const user = await prisma.user.update({
        where: { email },
        data: { passwordHash },
    });

    console.log("Password reset successfully!");
    console.log("Email:", user.email);
    console.log("New password:", newPassword);
}

resetPassword()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });