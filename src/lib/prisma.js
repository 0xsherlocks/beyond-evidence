import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis;
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Fast Refresh can preserve a client generated from an older Prisma schema.
// Recreate it when the generated PrismaClient class changes.
const cachedPrisma = globalForPrisma.prisma;
const hasCurrentSchema = cachedPrisma instanceof PrismaClient;

export const prisma =
  (hasCurrentSchema && cachedPrisma) ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
