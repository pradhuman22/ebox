'use client';
import { navigationLinks } from '@/constant';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const Navigation = () => {
  const pathname = usePathname();
  return (
    <nav className="flex items-center space-x-6 text-base font-medium">
      {navigationLinks.map((link, idx) => (
        <Link
          href={link.url}
          key={idx}
          className={cn(
            'hover:text-primary transition-colors',
            pathname.startsWith(link.url) ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
