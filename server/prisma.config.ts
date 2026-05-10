import { defineConfig } from "prisma/config";
import {config} from './src/config/config'

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx ts-node prisma/seed.ts",
  },
  datasource: {
    url: config.DATABASE_URL,
  },
});
