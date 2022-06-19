-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_taskId_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "taskId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
