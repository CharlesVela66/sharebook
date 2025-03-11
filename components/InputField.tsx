import { Label } from '@radix-ui/react-label';
import React, { ChangeEventHandler } from 'react';
import { Input } from './ui/input';

const InputField = ({
  type,
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  type: string;
  id: string;
  label: string;
  placeholder: string;
  value: string | number;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <>
      <Label htmlFor={id} className="text-dark-300 font-light text-[12px]">
        {label}
      </Label>
      <Input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="rounded-lg py-5 shadow-md bg-white"
      />
    </>
  );
};

export default InputField;
