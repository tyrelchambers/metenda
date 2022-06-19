import type { CategoriesOnTasks, Category, Task, User } from "@prisma/client";

import { prisma } from "~/db.server";

export function getAllTasks({
  userId,
  limit,
  after,
  before,
}: { limit?: number; after?: string; before?: string } & {
  userId: User["id"];
}) {
  return prisma.task.findMany({
    where: {
      userId,
      AND: [
        {
          createdAt: {
            gte: after || undefined,
          },
        },
        {
          createdAt: {
            lte: before || undefined,
          },
        },
      ],
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
      ...(categories && {
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
  categories,
}: Pick<Task, "id" | "done" | "title" | "notes"> & {
  userId: User["id"];
  categories?: string;
}) {
  if (categories) {
    const categoryIds = categories.split(",");
    for (let index = 0; index < categoryIds.length; index++) {
      const element = categoryIds[index];

      await prisma.categoriesOnTasks.create({
        data: {
          taskId: id,
          categoryId: element,
        },
      });
    }
  }

  return prisma.task.updateMany({
    where: { id, userId },
    data: {
      done,
      title,
      notes,
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
