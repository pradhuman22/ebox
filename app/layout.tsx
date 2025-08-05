import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from './_components/Header';
import Footer from './_components/Footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'ebox',
  description: 'An online event ticketing marketplace app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('bg-background min-h-screen font-sans antialiased')}>
        <Header />
        <main className="flex-1 flex-grow pb-20 md:pb-0">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
