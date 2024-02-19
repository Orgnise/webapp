import cx from "classnames";
// LoadingSpinner component
export const Spinner = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cx("h-10 w-10 animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="2"
      ></circle>
      <path
        className=""
        fill="currentColor"
        d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
      ></path>
    </svg>
  );
};
