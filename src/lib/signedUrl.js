import crypto from "node:crypto";

/**
 * Short-lived signed tokens for gating access to watermarked PDFs.
 *
 * A token binds { userId, slug, packageId, index, exp } together and is HMAC
 * signed with a server-only secret. It expires in a few minutes so a leaked
 * viewer URL cannot be replayed or shared for long.
 *
 * Uses PDF_SIGNING_SECRET, falling back to RAZORPAY_KEY_SECRET so the feature
 * works even before a dedicated secret is provisioned. Set PDF_SIGNING_SECRET
 * in production.
 */

const DEFAULT_TTL_SECONDS = 8 * 60; // 8 minutes (within the 5-10 min window)

function getSecret() {
    const secret = process.env.PDF_SIGNING_SECRET || process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
        throw new Error("Missing PDF_SIGNING_SECRET (or RAZORPAY_KEY_SECRET) for signing PDF URLs");
    }
    return secret;
}

function base64url(input) {
    return Buffer.from(input)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

function fromBase64url(input) {
    const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
    return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64").toString();
}

function sign(payloadB64) {
    return crypto
        .createHmac("sha256", getSecret())
        .update(payloadB64)
        .digest("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

function timingSafeEqual(a, b) {
    const aBuf = Buffer.from(a || "");
    const bBuf = Buffer.from(b || "");
    if (aBuf.length !== bBuf.length) return false;
    return crypto.timingSafeEqual(aBuf, bBuf);
}

/**
 * Create a signed access token.
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.slug
 * @param {string} params.packageId
 * @param {number} params.index
 * @param {number} [params.ttlSeconds]
 * @returns {string} `${payload}.${signature}`
 */
export function createSignedToken({ userId, slug, packageId, index, ttlSeconds = DEFAULT_TTL_SECONDS }) {
    const payload = {
        u: userId,
        s: slug,
        p: packageId,
        i: index,
        exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    };
    const payloadB64 = base64url(JSON.stringify(payload));
    return `${payloadB64}.${sign(payloadB64)}`;
}

/**
 * Verify a signed token.
 * @param {string} token
 * @returns {{ valid: boolean, reason?: string, payload?: object }}
 */
export function verifySignedToken(token) {
    if (!token || typeof token !== "string" || !token.includes(".")) {
        return { valid: false, reason: "malformed" };
    }

    const [payloadB64, signature] = token.split(".");

    if (!timingSafeEqual(sign(payloadB64), signature)) {
        return { valid: false, reason: "bad_signature" };
    }

    let payload;
    try {
        payload = JSON.parse(fromBase64url(payloadB64));
    } catch {
        return { valid: false, reason: "bad_payload" };
    }

    if (!payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) {
        return { valid: false, reason: "expired" };
    }

    return {
        valid: true,
        payload: {
            userId: payload.u,
            slug: payload.s,
            packageId: payload.p,
            index: payload.i,
            exp: payload.exp,
        },
    };
}

export const SIGNED_URL_TTL_SECONDS = DEFAULT_TTL_SECONDS;
