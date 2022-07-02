import { Button } from "~/components/Button";
import { Link } from "@remix-run/react";
import appSS from "public/assets/appSS.png";
import bg from "public/assets/bg.svg";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();

  return (
    <main className="relative overflow-hidden">
      <img
        src={bg}
        alt=""
        className="w-fill rotate absolute h-screen opacity-40"
      />
      <section className="relative z-10 mt-40 mb-40 ml-auto mr-auto flex  w-full max-w-4xl items-center p-10">
        <div className="flex flex-col items-center gap-10">
          <h1 className="text-7xl font-bold text-gray-800">
            Plan. <span className="text-indigo-500">Act.</span>{" "}
            <span className="underline">Succeed.</span>
          </h1>
          <p className=" text-xl font-thin leading-normal text-gray-600">
            <span className="font-bold">Metenda</span> is a week-by-week
            planner. No more individual days to worry about. Plan your tasks on
            a grander scale and see your progress from a birds-eye view.
          </p>
          {!user ? (
            <Link
              to="/join"
              className="flex h-[55px] w-fit min-w-fit items-center justify-center rounded-lg bg-indigo-500 px-20 text-sm text-white shadow-lg transition-all hover:bg-indigo-600"
            >
              Get started
            </Link>
          ) : (
            <Link
              to="/agenda"
              className="flex h-[55px] w-fit min-w-fit items-center justify-center rounded-lg bg-indigo-500 px-20 text-sm text-white shadow-lg transition-all hover:bg-indigo-600"
            >
              View your agenda
            </Link>
          )}
        </div>
      </section>
      <img
        src={appSS}
        alt=""
        className="relative z-10 ml-auto mr-auto w-full max-w-6xl rounded-3xl shadow-2xl"
      />
    </main>
  );
}
