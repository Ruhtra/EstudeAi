/*
  Warnings:

  - The `number` column on the `Text` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Text" DROP COLUMN "number",
ADD COLUMN     "number" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Text_number_key" ON "Text"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Text_number_examId_key" ON "Text"("number", "examId");
