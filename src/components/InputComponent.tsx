import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

interface inputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  parentClassName?: string;
}

export const InputComponent: React.FC<inputProps> = ({
  parentClassName,
  ...args
}) => {
  return (
    <div className={` ${parentClassName} `}>
      <input
        type={args.type}
        typeof={args.typeof}
        onChange={args.onChange}
        placeholder={args.placeholder}
        className={` focus:outline-none  h-3  w-full border-gray-500 dark:bg-black dark:text-white border dark:border-white p-6 rounded ${args.className} `}
        value={args.value}
        name={args.name}
        id={args.id}
      />
    </div>
  );
};
