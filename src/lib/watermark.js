import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";

/**
 * Dynamically watermark a PDF with the purchasing user's identity.
 *
 * The watermark is a semi-transparent, diagonally-rotated, repeating (tiled)
 * text drawn across every page so it is hard to crop out. A near-invisible
 * forensic marker (purchase id) is also stamped in a corner for tracing even
 * if the visible watermark is removed.
 *
 * Generated fresh per request — do NOT cache the output. Every served copy is
 * uniquely traceable to the buyer.
 *
 * @param {Object} params
 * @param {ArrayBuffer|Uint8Array} params.pdfBytes  Source PDF bytes.
 * @param {string} [params.name]        Buyer's full name.
 * @param {string} [params.email]       Buyer's email.
 * @param {string} [params.purchaseId]  Purchase/order id.
 * @param {boolean} [params.includeTimestamp=true] Append an ISO timestamp line.
 * @param {number} [params.opacity=0.12] Opacity of the visible watermark (0-1).
 * @returns {Promise<Uint8Array>} Watermarked PDF bytes.
 */
export async function watermarkPdf({
    pdfBytes,
    name = "",
    email = "",
    purchaseId = "",
    includeTimestamp = true,
    opacity = 0.12,
}) {
    const pdfDoc = await PDFDocument.load(pdfBytes, {
        // Some source PDFs are lightly encrypted (owner password only). Allowing
        // this lets us still stamp them; it does not bypass real content passwords.
        ignoreEncryption: true,
    });

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Build the visible watermark label from whatever identity we have.
    const identityParts = [name, email, purchaseId].filter(Boolean);
    const primaryLine = identityParts.join("  \u00B7  ") || "LICENSED COPY";
    const timestampLine = includeTimestamp
        ? new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC"
        : "";

    const fontSize = 16;
    const color = rgb(0.45, 0.45, 0.5);
    const angle = 45;

    const pages = pdfDoc.getPages();

    for (const page of pages) {
        const { width, height } = page.getSize();

        // Tile spacing — larger diagonal reach needs a step based on page size.
        const stepX = 260;
        const stepY = 170;

        // Over-scan beyond page bounds so rotated text still covers corners.
        for (let y = -height; y < height * 2; y += stepY) {
            for (let x = -width; x < width * 2; x += stepX) {
                page.drawText(primaryLine, {
                    x,
                    y,
                    size: fontSize,
                    font,
                    color,
                    opacity,
                    rotate: degrees(angle),
                });

                if (timestampLine) {
                    page.drawText(timestampLine, {
                        x,
                        y: y - 18,
                        size: fontSize * 0.6,
                        font,
                        color,
                        opacity,
                        rotate: degrees(angle),
                    });
                }
            }
        }

        // Near-invisible forensic marker (bottom-left) for tracing even if the
        // visible watermark is cropped/edited out.
        if (purchaseId) {
            page.drawText(`ref:${purchaseId}`, {
                x: 6,
                y: 6,
                size: 6,
                font,
                color: rgb(0.5, 0.5, 0.5),
                opacity: 0.03,
            });
        }
    }

    return pdfDoc.save();
}
