-- AlterTable
ALTER TABLE "Text" ADD COLUMN     "imageKey" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "content" DROP NOT NULL;
