-- CreateTable
CREATE TABLE "PremiumPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "courseSlug" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "paymentId" TEXT,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PremiumPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PremiumPurchase_paymentId_key" ON "PremiumPurchase"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "PremiumPurchase_orderId_key" ON "PremiumPurchase"("orderId");

-- CreateIndex
CREATE INDEX "PremiumPurchase_userId_idx" ON "PremiumPurchase"("userId");

-- CreateIndex
CREATE INDEX "PremiumPurchase_courseSlug_idx" ON "PremiumPurchase"("courseSlug");

-- CreateIndex
CREATE INDEX "PremiumPurchase_userId_courseSlug_idx" ON "PremiumPurchase"("userId", "courseSlug");
