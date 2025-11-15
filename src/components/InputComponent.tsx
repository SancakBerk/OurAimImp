import { forwardRef } from "react";

interface inputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  parentClassName?: string;
  label?: string;
  error?: string;
}

export const InputComponent = forwardRef<HTMLInputElement, inputProps>(
  ({ parentClassName, label, error, ...args }, ref) => {
    return (
      <div className={`w-full ${parentClassName}`}>
        {label && (
          <label
            htmlFor={args.id || args.name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
          </label>
        )}
        <input
          disabled={args.disabled}
          ref={ref}
          type={args.type}
          typeof={args.typeof}
          onChange={args.onChange}
          placeholder={args.placeholder}
          className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            }
            ${
              args.disabled
                ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60"
                : "bg-white dark:bg-gray-800"
            }
            text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:border-transparent
            ${args.className}`}
          value={args.value}
          name={args.name}
          id={args.id || args.name}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);
InputComponent.displayName = "InputComponent";
