import React from 'react';
import Logo from './Logo';
import Link from 'next/link';
import { footerLinks } from '@/constant';
import NewsletterForm from './NewsLetterForm';

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="relative z-10 container mx-auto w-full max-w-screen-xl px-6 py-8 md:px-16">
        <div className="flex flex-wrap items-start gap-8 lg:flex-nowrap lg:gap-0">
          <div className="w-full space-y-1.5 md:mr-14 md:max-w-60">
            <Logo />
            <p className="text-muted-foreground text-sm">
              Unlock your event experience with our platform. Buy, sell, and explore events in your
              area.
            </p>
          </div>
          {footerLinks.map(({ title, links }, idx) => (
            <div className="w-full md:mr-14 md:max-w-40" key={idx}>
              <h3 className="mb-4 text-lg font-semibold uppercase">{title}</h3>
              <div className="grid gap-2 text-sm">
                {links.map(({ label, url }, idx) => (
                  <Link
                    href={url}
                    className="text-muted-foreground hover:text-foreground"
                    key={idx}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <NewsletterForm />
        </div>
      </div>
      <div className="text-muted-foreground mt-8 border-t py-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} EBOX. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
