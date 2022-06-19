/*
  Warnings:

  - Added the required column `body` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "body" TEXT NOT NULL;
