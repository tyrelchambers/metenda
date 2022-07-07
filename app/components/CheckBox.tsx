import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface CheckBoxProps {
  name: string;
  checked: boolean | null;
  label?: string;
  value?: string;
  inputValue: boolean;
  inputName: string;
}

const CheckBox = ({
  name,
  checked,
  label,
  value,
  inputValue,
  inputName,
  ...rest
}: CheckBoxProps) => {
  return (
    <button className="mb-4" name={name} value={value}>
      <input
        type="checkbox"
        name={inputName}
        hidden
        checked={inputValue}
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
    </button>
  );
};

export default CheckBox;
