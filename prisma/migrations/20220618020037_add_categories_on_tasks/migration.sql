-- CreateTable
CREATE TABLE "CategoriesOnTasks" (
    "taskId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "CategoriesOnTasks_pkey" PRIMARY KEY ("taskId","categoryId")
);

-- AddForeignKey
ALTER TABLE "CategoriesOnTasks" ADD CONSTRAINT "CategoriesOnTasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnTasks" ADD CONSTRAINT "CategoriesOnTasks_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
