import React from 'react';
import Logo from './Logo';
import Navigation from './Navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import UserButton from './UserButton';

const Header = () => {
  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b shadow backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:h-20 md:px-16">
        {/* left section: logo & mobile menu button */}
        <div className="flex items-center md:flex-1">
          {/* logo section */}
          <Logo />
        </div>
        {/* middle section: navigation */}
        <div className="hidden justify-center md:flex">
          <Navigation />
        </div>
        {/* right section: cta */}
        <div className="flex flex-1 items-center justify-end gap-2.5">
          <Button variant={'outline'} asChild className="hidden text-base md:flex">
            <Link href={'/dashboard/events/create'}>
              Become a host <ArrowRightIcon />
            </Link>
          </Button>
          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
