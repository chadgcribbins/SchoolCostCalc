import { cn } from '@/lib/utils';
import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | 'full';
  className?: string;
  as?: React.ElementType;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Container component for consistent layout and spacing
 */
export function Container({
  children,
  maxWidth = '7xl',
  className,
  as: Component = 'div',
  padding = 'md',
  ...props
}: ContainerProps) {
  // Tailwind max-width classes following standardized breakpoints
  const maxWidthClasses = {
    xs: 'max-w-xs', // 320px
    sm: 'max-w-sm', // 384px
    md: 'max-w-md', // 448px
    lg: 'max-w-lg', // 512px
    xl: 'max-w-xl', // 576px
    '2xl': 'max-w-2xl', // 672px
    '3xl': 'max-w-3xl', // 768px
    '4xl': 'max-w-4xl', // 896px
    '5xl': 'max-w-5xl', // 1024px
    '6xl': 'max-w-6xl', // 1152px
    '7xl': 'max-w-7xl', // 1280px
    full: 'max-w-full',
  };

  // Padding classes with responsive behavior
  const paddingClasses = {
    none: 'px-0',
    sm: 'px-3 sm:px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
  };

  return (
    <Component
      className={cn(
        'w-full mx-auto',
        paddingClasses[padding],
        maxWidthClasses[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
