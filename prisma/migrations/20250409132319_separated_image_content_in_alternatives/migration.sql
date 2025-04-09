-- AlterTable
ALTER TABLE "Alternative" ADD COLUMN     "imageKey" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "content" DROP NOT NULL;
