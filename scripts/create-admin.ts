import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";

async function main() {
    const email = process.argv[2];
    const password = process.argv[3];

    const passwordHash = await hash(password, 12);

    const user = await prisma.adminUser.create({
        data: { email, passwordHash },
    });

    console.log('Админ создан:', user.email);
}

main().finally(() => process.exit(0));