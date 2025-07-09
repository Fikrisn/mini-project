// components/ui/Button.tsx
import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'danger' | 'warning' | 'white';
};

export default function Button({ variant = 'white', children, className = '', ...rest }: Props) {
  const base = 'px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2';
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-300',
    white: 'bg-white text-gray-800 hover:bg-gray-100 focus:ring-gray-200 border',
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
