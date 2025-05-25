-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('MONTHLY', 'ANNUAL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "planType" "PlanType",
ADD COLUMN     "trialUsed" BOOLEAN NOT NULL DEFAULT false;
