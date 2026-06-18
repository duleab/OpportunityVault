-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "ntfyTopic" TEXT,
    "ntfyEnabled" BOOLEAN NOT NULL DEFAULT true,
    "ntfyServerUrl" TEXT NOT NULL DEFAULT 'https://ntfy.sh',
    "aiProvider" TEXT NOT NULL DEFAULT 'groq',
    "notifyDaysBefore" TEXT NOT NULL DEFAULT '[1,3,7]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "level" TEXT,
    "field" TEXT,
    "countries" TEXT NOT NULL DEFAULT '[]',
    "isRemote" BOOLEAN NOT NULL DEFAULT false,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "deadline" DATETIME,
    "startDate" DATETIME,
    "duration" TEXT,
    "hasFee" BOOLEAN NOT NULL DEFAULT false,
    "feeAmount" TEXT,
    "funding" TEXT,
    "applicationLink" TEXT,
    "sourceUrl" TEXT,
    "websiteUrl" TEXT,
    "eligibility" TEXT,
    "requirements" TEXT NOT NULL DEFAULT '[]',
    "languageReq" TEXT,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "urgencyLevel" TEXT NOT NULL DEFAULT 'normal',
    "status" TEXT NOT NULL DEFAULT 'SAVED',
    "appliedAt" DATETIME,
    "rejectedReason" TEXT,
    "notes" TEXT,
    "rawText" TEXT NOT NULL,
    "aiExtractedData" TEXT NOT NULL,
    "notificationsSent" TEXT NOT NULL DEFAULT '[]',
    "lastNotifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Opportunity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");
