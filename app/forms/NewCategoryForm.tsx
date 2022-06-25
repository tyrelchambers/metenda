import { Button } from "~/components/Button";
import CategoryPill from "~/components/CategoryPill";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "~/components/Input";
import Label from "~/components/Label";
import { faDice } from "@fortawesome/free-solid-svg-icons";
import { getRandomColor } from "~/utils";
import { useFetcher } from "@remix-run/react";
import { useState } from "react";

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  redirectTo: string;
}

const NewCategoryForm = ({ handleSubmit, redirectTo }: Props) => {
  const fetcher = useFetcher();

  const [color, setColor] = useState("#8E4AD0");

  const handleColorChange = () => {
    const color = getRandomColor();

    setColor(color);
  };

  return (
    <fetcher.Form
      className="shadow-lgl mt-8 flex w-full max-w-xl flex-col gap-4 rounded-3xl bg-white"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col">
        <Label htmlFor="title">Name</Label>
        <Input type="text" placeholder="Name of category" name="title" />
      </div>

      <div className="flex flex-col">
        <Label htmlFor="color">Color</Label>
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={handleColorChange}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
            <FontAwesomeIcon
              icon={faDice}
              name="color"
              className="w-6 text-white"
            />
          </span>
          <Input value={color} />
        </button>
      </div>

      <input type="text" hidden value={color} name="color" />
      <div className="flex flex-col">
        <Label>Preview</Label>
        <CategoryPill
          data={{
            title: "category preview",
            color,
          }}
        />
      </div>
      <hr className="mt-4 mb-4" />
      <Button>Save category</Button>

      {redirectTo && (
        <input type="text" hidden value={redirectTo} name="redirectTo" />
      )}
    </fetcher.Form>
  );
};

export default NewCategoryForm;
