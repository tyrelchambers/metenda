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
