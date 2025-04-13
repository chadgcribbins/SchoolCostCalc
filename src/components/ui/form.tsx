import { cn } from '@/lib/utils';
import React from 'react';

interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function FormGroup({ children, className, ...props }: FormGroupProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {children}
    </div>
  );
}

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function FormLabel({ children, required, className, ...props }: FormLabelProps) {
  return (
    <label className={cn('block text-sm font-medium text-gray-200', className)} {...props}>
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

interface FormRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function FormRow({ children, className, ...props }: FormRowProps) {
  return (
    <div className={cn('flex flex-col md:flex-row md:gap-6', className)} {...props}>
      {children}
    </div>
  );
}

interface FormColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function FormColumn({ children, className, ...props }: FormColumnProps) {
  return (
    <div className={cn('flex-1', className)} {...props}>
      {children}
    </div>
  );
}
