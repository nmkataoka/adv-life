import { ChangeEvent } from 'react';

type InputProps = {
  className?: string;
  id?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  value: string;
};

export function Input({
  className,
  id,
  onChange,
  placeholder,
  type = 'text',
  value,
}: InputProps): JSX.Element {
  return (
    <input
      className={className}
      id={id}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  );
}
