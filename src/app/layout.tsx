import { Inter } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Portugal School Cost Calculator',
  description: 'Calculate the cost of private international education in Portugal from 2025-2035',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-950 text-white`}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
