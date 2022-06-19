import Link from "~/components/Link";
import type { LoaderFunction } from "@remix-run/server-runtime";
import Pill from "~/components/Pill";
import React from "react";
import type { Task } from "@prisma/client";
import Wrapper from "~/layout/Wrapper";
import { getTaskById } from "~/models/task.server";
import { requireUserId } from "~/session.server";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const task = await getTaskById({ id: params.id, userId });
  return task;
};

const ItemId = () => {
  const task: Task = useLoaderData();

  return (
    <Wrapper>
      <main className="w-full">
        <section className="max-w-2xl rounded-3xl bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">{task.title}</h1>
            <Link to={`/task/${task.id}/edit`}>Edit</Link>
          </div>
          <p className="mt-4 whitespace-pre-wrap text-gray-600">{task.notes}</p>

          <ul className="flex flex-wrap gap-4">
            {task.categories.map((c) => (
              <li key={c.category.id}>
                <Pill data={c.category.title} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Wrapper>
  );
};

export default ItemId;
