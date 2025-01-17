import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

interface inputProps extends React.HTMLAttributes<HTMLInputElement> {
  defaultValueProp: string;
  onchangeProp: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholderProp: string;
  typeProp: HTMLInputTypeAttribute;
}

export const InputComponent: React.FC<inputProps> = ({
  defaultValueProp,
  onchangeProp,
  placeholderProp,
  typeProp,
  ...args
}) => {
  return (
    <input
      type={typeProp}
      onChange={onchangeProp}
      placeholder={placeholderProp}
      className="text-xl focus:outline-none p-5 rounded-lg w-6 h-3 "
    />
  );
};
