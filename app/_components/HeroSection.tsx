import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative z-10 container mx-auto w-full max-w-screen-xl px-4 py-8 md:px-16">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* content section */}
          <div className="flex flex-col space-y-6">
            <h1 className="text-4xl !leading-tight font-bold sm:text-5xl md:text-6xl">
              Explore, Organize, And <span className="text-primary">Attend </span> Events
            </h1>
            <p className="text-muted-foreground max-w-[600px] text-lg md:text-xl">
              Our platform offers a seamless experience for both{' '}
              <span className="text-primary font-semibold">Organizers And Attendees</span>. Easily
              book, host, and sell tickets for events.
            </p>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-6">
              <Button size="lg" className="group text-white" asChild>
                <Link href={'/dashboard/events/create'}>
                  Host Event
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="hover:border-primary hover:bg-primary bg-transparent hover:text-white"
              >
                <Link href={'/events'}>Explore Events</Link>
              </Button>
            </div>
          </div>
          {/* image section */}
          <div className="relative w-full">
            <Image
              src="/hero-new.svg?height=600&width=600"
              alt="Event management showcase"
              width={600}
              height={600}
              className="object-cover"
              priority
              quality={100}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
