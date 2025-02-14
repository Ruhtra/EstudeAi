/*
  Warnings:

  - Added the required column `contentType` to the `Text` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('text', 'image');

-- AlterTable
ALTER TABLE "Text" ADD COLUMN     "contentType" "ContentType" NOT NULL;
