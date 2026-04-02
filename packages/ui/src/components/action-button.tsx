'use client';

import { useState } from 'react';

export interface ActionButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  feedbackDuration?: number;
  feedbackText?: string;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'danger' | 'secondary';
}

const variantStyles = {
  primary: {
    default: 'bg-blue-600 hover:bg-blue-700 text-white',
    feedback: 'bg-blue-500 hover:bg-blue-600 text-white',
  },
  success: {
    default: 'bg-green-600 hover:bg-green-700 text-white',
    feedback: 'bg-green-500 hover:bg-green-600 text-white',
  },
  danger: {
    default: 'bg-red-600 hover:bg-red-700 text-white',
    feedback: 'bg-red-500 hover:bg-red-600 text-white',
  },
  secondary: {
    default: 'bg-surface-elevated hover:bg-surface-skeleton text-on-surface',
    feedback: 'bg-surface-skeleton hover:bg-surface-elevated text-on-surface',
  },
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
};

export function ActionButton({
  children,
  className = '',
  disabled = false,
  feedbackDuration = 2000,
  feedbackText,
  onClick,
  size = 'md',
  variant = 'primary',
}: ActionButtonProps) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    if (isActive || disabled) return; // debounce

    onClick();

    if (feedbackText) {
      setIsActive(true);
      setTimeout(() => setIsActive(false), feedbackDuration);
    }
  };

  const variantClass = isActive
    ? variantStyles[variant].feedback
    : variantStyles[variant].default;
  const sizeClass = sizeStyles[size];
  const disabledClass =
    isActive || disabled ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      className={`rounded transition-all ${variantClass} ${sizeClass} ${disabledClass} ${className}`}
      disabled={isActive || disabled}
      onClick={handleClick}
    >
      {isActive && feedbackText ? `✓ ${feedbackText}` : children}
    </button>
  );
}
