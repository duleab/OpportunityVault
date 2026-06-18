-- CreateEnum
CREATE TYPE "OpportunityType" AS ENUM ('SCHOLARSHIP', 'FELLOWSHIP', 'GRANT', 'JOB', 'INTERNSHIP', 'RESEARCH', 'SUMMER_PROGRAM', 'COMPETITION', 'CONFERENCE', 'VOLUNTEER', 'EXCHANGE', 'TRAINING', 'OTHER');

-- CreateEnum
CREATE TYPE "AppStatus" AS ENUM ('SAVED', 'PLANNING', 'IN_PROGRESS', 'APPLIED', 'INTERVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'SKIPPED', 'EXPIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "ntfyTopic" TEXT,
    "ntfyEnabled" BOOLEAN NOT NULL DEFAULT true,
    "ntfyServerUrl" TEXT NOT NULL DEFAULT 'https://ntfy.sh',
    "aiProvider" TEXT NOT NULL DEFAULT 'groq',
    "notifyDaysBefore" TEXT NOT NULL DEFAULT '[1,3,7]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT,
    "description" TEXT,
    "type" "OpportunityType" NOT NULL,
    "level" TEXT,
    "field" TEXT,
    "countries" TEXT NOT NULL DEFAULT '[]',
    "isRemote" BOOLEAN NOT NULL DEFAULT false,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "deadline" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
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
    "status" "AppStatus" NOT NULL DEFAULT 'SAVED',
    "appliedAt" TIMESTAMP(3),
    "rejectedReason" TEXT,
    "notes" TEXT,
    "rawText" TEXT NOT NULL,
    "aiExtractedData" TEXT NOT NULL,
    "notificationsSent" TEXT NOT NULL DEFAULT '[]',
    "lastNotifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
