-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "done" DROP NOT NULL,
ALTER COLUMN "done" SET DEFAULT false;
