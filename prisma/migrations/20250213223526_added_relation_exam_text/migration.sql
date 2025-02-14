/*
  Warnings:

  - Added the required column `examId` to the `Text` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Text" ADD COLUMN     "examId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Text" ADD CONSTRAINT "Text_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
