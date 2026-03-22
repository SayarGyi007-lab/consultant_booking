import bcrypt from "bcrypt"
import prisma from "../config/prisma.client"
import { config } from "../config/config"
import { Role } from "@prisma/client"


const createAdmin = async () => {
    try {
        const adminEmail = config.ADMIN_EMAIL!
        const adminPassword = config.ADMIN_PASSWORD!
        const phone = "0000000000"

        const existed = await prisma.user.findUnique({
            where: { email: adminEmail },
        });

        if (existed) {
            console.log("Super admin already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await prisma.user.create({
            data: {
                firstName: "Admin",
                lastName: "User",
                email: adminEmail,
                phone: phone,
                password: hashedPassword,
                role: Role.ADMIN
            }
        });

        console.log("Super admin successfully created ");
    } catch (err) {
        console.error("Error creating super admin:", err)
    }

}

createAdmin()
