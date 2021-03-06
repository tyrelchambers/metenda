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
  // used to return specific tasks within a timeframe
  if (after || before) {
    return prisma.task.findMany({
      where: {
        userId,
        OR: [
          {
            fromDate: {
              lt: before || undefined,
            },
            toDate: {
              gt: after || undefined,
            },
          },
          {
            fromDate: {
              lt: before || undefined,
            },
            toDate: null,
          },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        categories: {
          select: {
            category: true,
          },
        },
      },
    });
  } else {
    // returns all tasks used on tasks.tsx
    return prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: { createdAt: "asc" },
      include: {
        categories: {
          select: {
            category: true,
          },
        },
      },
    });
  }
}

export function createTask({
  title,
  notes,
  userId,
  fromDate,
  toDate,
  categories,
  priority,
}: Pick<Task, "notes" | "title" | "fromDate" | "toDate" | "priority"> & {
  userId: User["id"];
  categories?: string;
}) {
  return prisma.task.create({
    data: {
      title,
      notes,
      fromDate,
      toDate,
      priority,
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
  fromDate,
  toDate,
  incomplete,
  priority,
}: Partial<Task> & {
  userId: User["id"];
}) {
  return prisma.task.updateMany({
    data: {
      done: done == true,
      title,
      notes,
      fromDate,
      toDate,
      priority,
      incomplete: incomplete == true,
    },
    where: {
      id,
      userId,
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

export async function deleteTask({
  id,
  userId,
}: Pick<Task, "id"> & { userId: User["id"] }) {
  await prisma.categoriesOnTasks.deleteMany({
    where: {
      taskId: id,
    },
  });

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

export function totalTasksCount({ userId }: { userId: User["id"] }) {
  return prisma.task.groupBy({
    where: { userId },
    by: ["fromDate", "toDate"],
    _count: true,
  });
}

export function totalCompletedTasksCount({ userId }: { userId: User["id"] }) {
  return prisma.task.groupBy({
    where: { userId, done: true },
    by: ["fromDate", "toDate"],
    _count: true,
  });
}
