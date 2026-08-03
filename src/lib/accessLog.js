import { prisma } from "@/src/lib/prisma";

/**
 * Best-effort audit logging for PDF access attempts (success and denied).
 * Never throws — a logging failure must not break the request flow.
 *
 * @param {Object} entry
 * @param {string|null} [entry.userId]
 * @param {string|null} [entry.purchaseId]
 * @param {string|null} [entry.slug]
 * @param {string|null} [entry.packageId]
 * @param {number|null} [entry.index]
 * @param {string} entry.outcome  e.g. "served", "denied"
 * @param {string|null} [entry.reason]
 * @param {Request} [request]  Used to extract IP + user agent.
 */
export async function logAccess(entry, request) {
    try {
        const headers = request?.headers;
        const ip =
            headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            headers?.get("x-real-ip") ||
            null;
        const userAgent = headers?.get("user-agent") || null;

        await prisma.accessLog.create({
            data: {
                userId: entry.userId ?? null,
                purchaseId: entry.purchaseId ?? null,
                slug: entry.slug ?? null,
                packageId: entry.packageId ?? null,
                index: Number.isInteger(entry.index) ? entry.index : null,
                ip,
                userAgent,
                outcome: entry.outcome,
                reason: entry.reason ?? null,
            },
        });
    } catch (error) {
        // Swallow logging errors; auditing is best-effort.
        console.error("[accessLog] failed to record access attempt:", error?.message);
    }
}
