'use client';

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@radix-ui/react-dialog';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}: ModalProps) => {
  // Size classes based on Flowbite's modal sizes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent
        className={cn(
          'p-0 gap-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl',
          sizeClasses[size],
          className
        )}
      >
        {title && (
          <DialogHeader className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white text-xl font-semibold">{title}</DialogTitle>
              <button
                onClick={onClose}
                className="text-gray-400 bg-transparent hover:bg-gray-700 hover:text-white rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {description && (
              <DialogDescription className="mt-1 text-gray-400">{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">{children}</div>

        {footer && <DialogFooter className="p-4 border-t border-gray-700">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
