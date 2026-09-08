CREATE TABLE "Notification" (
    "id" TEXT NOT NULL, "externalId" TEXT NOT NULL, "type" TEXT NOT NULL,
    "title" TEXT NOT NULL, "excerpt" TEXT, "link" TEXT, "source" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3), "isNew" BOOLEAN NOT NULL DEFAULT true,
    "acronym" TEXT, "fullName" TEXT, "location" TEXT,
    "submissionDeadline" TIMESTAMP(3), "notificationDate" TIMESTAMP(3),
    "cameraReadyDate" TIMESTAMP(3), "startDate" TIMESTAMP(3), "endDate" TIMESTAMP(3),
    "topics" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], "cfpLink" TEXT,
    "conferenceWebPage" TEXT, "submissionLink" TEXT, "description" TEXT,
    "submissionGuidelines" TEXT, "importantDates" JSONB, "topicSections" JSONB,
    "committees" JSONB, "publication" TEXT, "venue" TEXT, "contactEmail" TEXT,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastDetailFetch" TIMESTAMP(3), CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Notification_externalId_key" ON "Notification"("externalId");
CREATE INDEX "Notification_type_publishedAt_idx" ON "Notification"("type", "publishedAt");
CREATE INDEX "Notification_type_isNew_idx" ON "Notification"("type", "isNew");
CREATE INDEX "Notification_acronym_idx" ON "Notification"("acronym");
CREATE INDEX "Notification_startDate_idx" ON "Notification"("startDate");
CREATE INDEX "Notification_submissionDeadline_idx" ON "Notification"("submissionDeadline");
