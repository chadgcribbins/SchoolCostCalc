import { cn } from '@/lib/utils';
import React from 'react';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'dark'
  | 'light';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-700 text-gray-100',
  primary: 'bg-blue-900 text-blue-100',
  success: 'bg-green-900 text-green-100',
  warning: 'bg-yellow-900 text-yellow-100',
  danger: 'bg-red-900 text-red-100',
  info: 'bg-sky-900 text-sky-100',
  dark: 'bg-gray-800 text-gray-100',
  light: 'bg-gray-600 text-gray-100 border border-gray-500',
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'text-xs px-1.5 py-0.5',
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-0.5',
  lg: 'text-sm px-3 py-1',
};

/**
 * Badge component for small labels and statuses
 */
export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
