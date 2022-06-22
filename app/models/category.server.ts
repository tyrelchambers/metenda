import { Category, User } from "@prisma/client";

import { prisma } from "~/db.server";

export function createCategory({
  title,
  userId,
  color,
  textColor,
}: Pick<Category, "title" | "color" | "textColor"> & {
  userId: User["id"];
}) {
  return prisma.category.create({
    data: {
      title,
      color,
      textColor,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function getAllCategories({ userId }: { userId: User["id"] }) {
  return prisma.category.findMany({
    where: {
      userId,
    },
  });
}

export function getCategoryById({
  userId,
  id,
}: {
  userId: User["id"];
  id: Category["id"];
}) {
  return prisma.category.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export function updateCategory({
  title,
  color,
  textColor,
  id,
  userId,
}: Pick<Category, "title" | "color" | "textColor"> & {
  userId: User["id"];
  id: Category["id"];
}) {
  return prisma.category.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      title,
      color,
      textColor,
    },
  });
}

export async function deleteCategory({
  id,
  userId,
}: {
  id: Category["id"];
  userId: User["id"];
}) {
  await prisma.categoriesOnTasks.deleteMany({
    where: {
      categoryId: id,
    },
  });

  return prisma.category.deleteMany({
    where: {
      id,
      userId,
    },
  });
}
