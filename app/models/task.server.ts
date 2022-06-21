import type { CategoriesOnTasks, Category, Task, User } from "@prisma/client";

import { isSameWeek } from "date-fns";
import { prisma } from "~/db.server";

export function getAllTasks({
  userId,
  limit,
  after,
  before,
}: { limit?: number; after?: string; before?: string } & {
  userId: User["id"];
}) {
  console.log("getAllTasks", { userId, limit, after, before });

  return prisma.task.findMany({
    where: {
      userId,
      fromDate: {
        lt: before || undefined,
      },
      toDate: {
        gt: after || undefined,
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export function createTask({
  title,
  notes,
  userId,
  fromDate,
  toDate,
  willRepeatEveryWeek,
  categories,
}: Pick<
  Task,
  "notes" | "title" | "fromDate" | "toDate" | "willRepeatEveryWeek"
> & { userId: User["id"]; categories?: string }) {
  return prisma.task.create({
    data: {
      title,
      notes,
      fromDate,
      toDate,
      willRepeatEveryWeek: Boolean(willRepeatEveryWeek),
      user: {
        connect: {
          id: userId,
        },
      },
      ...(categories !== "null" && {
        categories: {
          create: [
            ...categories.split(",").map((category) => ({
              category: {
                connect: {
                  id: category,
                },
              },
            })),
          ],
        },
      }),
    },
  });
}

export async function updateTask({
  id,
  done,
  title,
  notes,
  userId,
}: Pick<Task, "id" | "done" | "title" | "notes"> & {
  userId: User["id"];
}) {
  return prisma.task.updateMany({
    where: { id, userId },
    data: {
      done,
      title,
      notes,
    },
  });
}

export async function createCategoryOnTask({
  taskId,
  categoryId,
}: {
  taskId: Task["id"];
  categoryId: Category["id"];
}) {
  return prisma.categoriesOnTasks.create({
    data: {
      categoryId,
      taskId,
    },
  });
}

export function getTaskById({
  id,
  userId,
}: Pick<Task, "id"> & { userId: User["id"] }) {
  return prisma.task.findFirst({
    where: { id, userId },
    include: {
      categories: {
        select: {
          category: true,
        },
      },
    },
  });
}

export function deleteTask({
  id,
  userId,
}: Pick<Task, "id"> & { userId: User["id"] }) {
  return prisma.task.deleteMany({
    where: { id, userId },
  });
}

export function deleteCategoryOnTask({
  taskId,
  categoryId,
}: Pick<CategoriesOnTasks, "taskId" | "categoryId">) {
  return prisma.categoriesOnTasks.deleteMany({
    where: { taskId, categoryId },
  });
}
