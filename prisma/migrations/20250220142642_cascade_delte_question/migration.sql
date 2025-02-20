-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_disciplineId_fkey";

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;
