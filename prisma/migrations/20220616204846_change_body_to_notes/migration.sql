/*
  Warnings:

  - You are about to drop the column `body` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `notes` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "body",
ADD COLUMN     "notes" TEXT NOT NULL;

-- DropTable
DROP TABLE "Note";
