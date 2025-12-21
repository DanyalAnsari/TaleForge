-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isActive" BOOLEAN DEFAULT true,
ADD COLUMN     "role" TEXT DEFAULT 'READER';
