import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface CheckBoxProps {
  name: string;
  changeHandler: () => void;
  checked: boolean;
  label?: string;
}

const CheckBox = ({
  name,
  changeHandler,
  checked,
  label,
  ...rest
}: CheckBoxProps) => {
  return (
    <label htmlFor={name} onClick={changeHandler} className="mb-4">
      <input
        type="checkbox"
        name={name}
        hidden
        checked={checked}
        {...rest}
        readOnly
      />
      <div className="flex items-center gap-2">
        <div
          className={`mr-2 flex h-5 w-5 items-center justify-center rounded-md border-2 border-indigo-500 ${
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
        {label && <p className="text-sm font-thin text-gray-700">{label}</p>}
      </div>
    </label>
  );
};

export default CheckBox;
