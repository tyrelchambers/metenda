interface IButton {
  variant?: undefined | "secondary";
  children: JSX.Element | string;
  [x: string]: any;
}

export const Button = ({
  variant,
  children,
  className = "",
  ...prop
}: IButton) => {
  if (variant === "secondary") {
    return (
      <button
        type="button"
        className={`h-[38px] min-w-fit rounded-lg border-2 border-gray-200 bg-white px-6 text-sm text-gray-600 transition-all hover:bg-gray-200 ${className}`}
        {...prop}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      type="submit"
      className={`h-[35px] min-w-fit rounded-lg bg-indigo-500 px-6 text-sm text-white transition-all hover:bg-indigo-600 ${className}`}
      {...prop}
    >
      {children}
    </button>
  );
};
