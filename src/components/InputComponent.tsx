import { forwardRef } from "react";

interface inputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  parentClassName?: string;
}

export const InputComponent = forwardRef<HTMLInputElement, inputProps>(
  ({ parentClassName, ...args }, ref) => {
    return (
      <div className={` ${parentClassName} `}>
        <input
          disabled={args.disabled}
          ref={ref}
          type={args.type}
          typeof={args.typeof}
          onChange={args.onChange}
          placeholder={args.placeholder}
          className={` focus:outline-none  h-3  w-full border-gray-500 dark:bg-darkBackground dark:text-white border dark:border-white p-6 rounded ${args.className} `}
          value={args.value}
          name={args.name}
          id={args.id}
        />
      </div>
    );
  }
);
InputComponent.displayName = "InputComponent";
