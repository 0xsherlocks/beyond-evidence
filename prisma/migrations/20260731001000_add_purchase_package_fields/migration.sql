ALTER TABLE "Purchase" ADD COLUMN "packageId" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Purchase" ADD COLUMN "packageName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Purchase" ALTER COLUMN "paymentId" DROP NOT NULL;

CREATE UNIQUE INDEX "Purchase_orderId_key" ON "Purchase"("orderId");

ALTER TABLE "Purchase" ALTER COLUMN "packageId" DROP DEFAULT;
ALTER TABLE "Purchase" ALTER COLUMN "packageName" DROP DEFAULT;
