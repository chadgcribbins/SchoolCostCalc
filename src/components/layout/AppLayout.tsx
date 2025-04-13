'use client';

import React from 'react';
import { Container } from '@/components/ui/container';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900 shadow-md border-b border-gray-800">
        <Container className="py-4" maxWidth="7xl">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">Portugal School Cost Calculator</h1>
            <nav className="hidden md:flex space-x-4 text-sm">
              <a href="/" className="text-white hover:text-primary-400 font-medium">
                Calculator
              </a>
              <a href="/about" className="text-gray-300 hover:text-primary-400">
                About
              </a>
              <a href="/help" className="text-gray-300 hover:text-primary-400">
                Help
              </a>
            </nav>
            <button className="md:hidden p-2 text-gray-300 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </Container>
      </header>

      <main className={cn('py-6 md:py-8', className)}>
        <Container maxWidth="7xl">{children}</Container>
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-6">
        <Container maxWidth="7xl">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Portugal School Cost Calculator
              </p>
            </div>
            <div className="flex space-x-4 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-primary-400">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-primary-400">
                Terms of Service
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
