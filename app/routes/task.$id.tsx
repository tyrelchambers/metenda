import {
  faArrowRightLong,
  faClock,
  faFlag,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { format, parseISO } from "date-fns";

import CategoryPill from "~/components/CategoryPill";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Heading } from "~/components/Heading";
import Link from "~/components/Link";
import type { LoaderFunction } from "@remix-run/server-runtime";
import Main from "~/layout/Main";
import React from "react";
import { SecondaryButtonStyles } from "~/components/Button";
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
              <Heading type="h1">{task.title}</Heading>

              <Link
                to={`/task/${task.id}/edit`}
                className={SecondaryButtonStyles}
              >
                Edit
              </Link>
            </div>
            <div className=" mt-4 mb-4 flex items-center gap-6">
              <p className="flex items-center gap-2 text-indigo-500">
                <FontAwesomeIcon
                  icon={faClock}
                  style={{ width: "10px" }}
                  className="text-indigo-700"
                />
                {format(parseISO(task.fromDate), "MMMM do, yyyy")}
              </p>

              {task.toDate && (
                <>
                  <FontAwesomeIcon
                    icon={faArrowRightLong}
                    className="text-indigo-700"
                    style={{ width: "20px" }}
                  />
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faClock}
                      style={{ width: "10px" }}
                      className="text-indigo-700"
                    />
                    <p className="text-indigo-500">
                      {format(parseISO(task.toDate), "MMMM do, yyyy")}
                    </p>
                  </span>
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
          <ul className=" mt-6 flex flex-wrap gap-4">
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
