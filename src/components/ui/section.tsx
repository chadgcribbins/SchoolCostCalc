import { cn } from '@/lib/utils';
import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
}

/**
 * Section component for consistent section styling
 */
export function Section({
  title,
  description,
  children,
  className,
  titleClassName,
  descriptionClassName,
  contentClassName,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        'bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden',
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="border-b border-gray-700 bg-gray-900 px-6 py-4">
          {title && (
            <h2 className={cn('text-lg font-semibold text-white', titleClassName)}>{title}</h2>
          )}
          {description && (
            <p className={cn('mt-1 text-sm text-gray-400', descriptionClassName)}>{description}</p>
          )}
        </div>
      )}
      <div className={cn('px-6 py-5', contentClassName)}>{children}</div>
    </section>
  );
}
