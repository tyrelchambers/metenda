import { format, parseISO } from "date-fns";

import CategoryPill from "~/components/CategoryPill";
import Link from "~/components/Link";
import type { LoaderFunction } from "@remix-run/server-runtime";
import Main from "~/layout/Main";
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
      <Main>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">{task.title}</h1>

              <Link to={`/task/${task.id}/edit`}>Edit</Link>
            </div>
            <div className=" mt-8 mb-4 flex items-center gap-6 rounded-2xl border-[1px] border-indigo-300 p-4">
              <p className="text-sm font-bold text-indigo-600">
                Task is for the week of:
              </p>
              <p className="text-gray-500">
                {format(parseISO(task.fromDate), "MMMM do, yyyy")}
              </p>
              {task.toDate && (
                <>
                  <hr className="flex-1" />
                  <p className="text-gray-500">
                    {format(parseISO(task.toDate), "MMMM do, yyyy")}
                  </p>
                </>
              )}
            </div>
          </div>
          {task.notes ? (
            <p className="mt-4 whitespace-pre-wrap text-sm font-thin text-gray-500">
              {task.notes}
            </p>
          ) : (
            <p className="mt-4 whitespace-pre-wrap text-sm font-thin italic text-gray-500">
              No notes on this task
            </p>
          )}
          <ul className="mt-6 flex flex-wrap gap-4">
            {task.categories.map((c) => (
              <li key={c.category.id}>
                <CategoryPill data={c.category} />
              </li>
            ))}
          </ul>
        </div>
      </Main>
    </Wrapper>
  );
};

export default ItemId;
