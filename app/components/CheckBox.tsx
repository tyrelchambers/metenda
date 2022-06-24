import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface CheckBoxProps {
  name: string;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
}

const CheckBox = ({
  name,
  defaultChecked,
  onChange,
  checked,
  ...rest
}: CheckBoxProps) => {
  return (
    <label>
      <input
        type="checkbox"
        name={name}
        hidden
        className="mr-4"
        defaultChecked={defaultChecked}
        onChange={onChange}
        {...rest}
      />
      <div
        className={`mr-4 flex h-5 w-5 items-center justify-center rounded-md border-2 border-indigo-500 ${
          checked && "bg-indigo-500"
        }`}
      >
        {checked && (
          <FontAwesomeIcon
            icon={faCheck}
            style={{ width: "10px" }}
            className="text-white"
          />
        )}
      </div>
    </label>
  );
};

export default CheckBox;
