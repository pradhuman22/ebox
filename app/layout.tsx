import type { Metadata } from "next";
import "./globals.css";
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: "ebox",
  description: "An online event ticketing marketplace app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn('bg-background font-sans antialiased relative min-h-screen')}
      >
        {children}
      </body>
    </html>
  );
}
