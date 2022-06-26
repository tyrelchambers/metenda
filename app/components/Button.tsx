interface IButton {
  variant?: undefined | "secondary";
  children: JSX.Element | string;
  [x: string]: any;
}

export const PrimaryButtonStyles = `flex h-[40px] min-w-fit items-center justify-center rounded-lg bg-indigo-500 px-6 text-sm text-white transition-all hover:bg-indigo-600`;
export const SecondaryButtonStyles = `h-[42px] min-w-fit flex items-center justify-center no-underline rounded-lg border-2 border-gray-200 bg-white px-6 text-sm text-gray-600 transition-all hover:bg-gray-200`;

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
        className={`${SecondaryButtonStyles} ${className}`}
        {...prop}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      type="submit"
      className={`${PrimaryButtonStyles} ${className}`}
      {...prop}
    >
      {children}
    </button>
  );
};
