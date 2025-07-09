// components/ui/InputField.tsx
import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function InputField({ label, className = '', ...rest }: Props) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="mb-1 text-gray-700 font-medium">{label}</label>
      <input
        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
        {...rest}
      />
    </div>
  );
}
