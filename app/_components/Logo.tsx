import { BoxIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Logo = () => {
  return (
    <Link href={'/'}>
      <h1 className="flex items-center text-2xl font-bold uppercase">
        EB
        <BoxIcon className="fill-primary stroke-primary-foreground h-7 w-7" />X
      </h1>
    </Link>
  );
};

export default Logo;
