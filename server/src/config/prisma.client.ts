import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "./config";

const isProduction = config.NODE_ENV === "production";

const pool = new Pool({
  connectionString: isProduction
    ? config.DATABASE_URL_PRODUCTION:
    config.DATABASE_URL
});

// const pool = new Pool({
//   connectionString: config.DATABASE_URL
// })

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

export default prisma;