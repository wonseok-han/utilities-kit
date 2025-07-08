'use client';

import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export const Button = ({ appName, children, className }: ButtonProps) => {
  return (
    <button
      className={`${className} text-amber-200 text-7xl bg-blue-500 p-4 rounded`}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};
