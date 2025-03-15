/*
  Warnings:

  - The `number` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[number]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "number",
ADD COLUMN     "number" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Question_number_key" ON "Question"("number");
