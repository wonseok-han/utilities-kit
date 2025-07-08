'use client';

export interface CodeTextareaProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  rows?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  ref?: React.Ref<HTMLTextAreaElement>;
}

export function CodeTextarea({
  autoFocus = false,
  className = '',
  disabled = false,
  onChange,
  placeholder,
  readOnly = false,
  ref,
  rows,
  value,
}: CodeTextareaProps) {
  const baseClasses = `
    flex-1
    bg-gray-800
    border border-gray-700
    rounded-lg
    p-4
    text-white
    font-mono
    text-sm
    resize-none
    focus:outline-none
  `
    .replace(/\s+/g, ' ')
    .trim();

  const interactiveClasses = readOnly
    ? ''
    : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <textarea
      autoFocus={autoFocus}
      className={`${baseClasses} ${interactiveClasses} ${disabledClasses} ${className}`}
      disabled={disabled}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      readOnly={readOnly}
      ref={ref}
      rows={rows}
      value={value}
    />
  );
}
