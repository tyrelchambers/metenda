import { Category, User } from "@prisma/client";

import { Task } from "vitest";
import { prisma } from "~/db.server";

export function createCategory({
  title,
  userId,
}: Pick<Category, "title"> & {
  userId: User["id"];
}) {
  return prisma.category.create({
    data: {
      title,
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
