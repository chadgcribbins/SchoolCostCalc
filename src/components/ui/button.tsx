import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        blue: 'bg-blue-600 hover:bg-blue-700 text-white',
        dark: 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700',
        light: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
        green: 'bg-green-600 hover:bg-green-700 text-white',
        red: 'bg-red-600 hover:bg-red-700 text-white',
        yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        purple: 'bg-purple-600 hover:bg-purple-700 text-white',
        'outline-blue': 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
        'outline-dark': 'border border-gray-700 text-gray-300 hover:bg-gray-700',
        'outline-light':
          'border border-gray-400 text-gray-400 hover:bg-gray-100 hover:text-gray-700',
        'outline-green':
          'border border-green-600 text-green-600 hover:bg-green-600 hover:text-white',
        'outline-red': 'border border-red-600 text-red-600 hover:bg-red-600 hover:text-white',
        'outline-yellow':
          'border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white',
        'outline-purple':
          'border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
        xs: 'px-3 py-1.5 text-xs',
        md: 'h-9 px-5 py-2.5',
        xl: 'h-11 px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
