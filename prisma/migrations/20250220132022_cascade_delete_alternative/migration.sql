-- DropForeignKey
ALTER TABLE "Alternative" DROP CONSTRAINT "Alternative_questionId_fkey";

-- AddForeignKey
ALTER TABLE "Alternative" ADD CONSTRAINT "Alternative_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
