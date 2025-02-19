/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Text` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number,examId]` on the table `Text` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contentType` to the `Alternative` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alternative" ADD COLUMN     "contentType" "ContentType" NOT NULL;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Text_number_key" ON "Text"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Text_number_examId_key" ON "Text"("number", "examId");
