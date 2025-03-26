-- DropIndex
DROP INDEX "Text_number_key";

-- AlterTable
ALTER TABLE "Text" ALTER COLUMN "number" DROP DEFAULT;
DROP SEQUENCE "Text_number_seq";
