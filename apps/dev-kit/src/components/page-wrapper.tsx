import type { PropsWithChildren } from 'react';

interface PageWrapperProps {
  className?: string;
}

export default function PageWrapper({
  children,
  className,
}: PropsWithChildren<PageWrapperProps>) {
  return (
    <div className={`flex flex-col min-h-fit h-full p-8 ${className}`}>
      {children}
    </div>
  );
}
