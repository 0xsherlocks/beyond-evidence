CREATE TABLE "EasyChairSyncState" (
    "id" TEXT NOT NULL,
    "offset" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EasyChairSyncState_pkey" PRIMARY KEY ("id")
);