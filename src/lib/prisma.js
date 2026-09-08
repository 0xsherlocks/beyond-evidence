import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis;
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Fast Refresh can preserve a client generated before a new Prisma model was
// added. Recreate it when that happens instead of serving an incomplete client.
const cachedPrisma = globalForPrisma.prisma;
const hasCurrentSchema = cachedPrisma && typeof cachedPrisma.notification !== "undefined";

export const prisma =
  (hasCurrentSchema && cachedPrisma) ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
