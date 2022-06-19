/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `CategoriesOnTasks` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `CategoriesOnTasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CategoriesOnTasks" DROP COLUMN "assignedAt",
DROP COLUMN "assignedBy";
