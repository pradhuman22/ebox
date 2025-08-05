import React from 'react';
import { prisma } from '@/prisma/client';
import { cn } from '@/lib/utils';
import EventSearchBox from './_components/EventSearchBox';
import EventFilters from './_components/EventFilters';
import EventCard from './_components/EventCard';

type EventListProps = {
  searchParams: Promise<{
    view?: 'grid' | 'list';
    sort?: 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc';
    category?: string;
    keyword?: string;
  }>;
};

const EventsListPage = async ({ searchParams }: EventListProps) => {
  const { view, sort, category, keyword } = await searchParams;
  const viewMode = view === 'list' ? 'list' : 'grid';
  const events = await prisma.event.findMany({
    where: {
      OR: keyword
        ? [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
            { venue: { contains: keyword, mode: 'insensitive' } },
          ]
        : undefined,
      category: category ? { slug: category } : undefined,
    },
    orderBy: {
      [sort?.split('-')[0] || 'createdAt']: sort?.split('-')[1] === 'asc' ? 'asc' : 'desc',
    },
    include: {
      category: true,
      host: true,
      tickets: true,
    },
  });
  return (
    <div className="relative z-10 container mx-auto w-full max-w-screen-xl px-4 pb-8 md:px-16">
      <div className="flex h-20 items-center gap-6">
        <div className="flex flex-1 flex-col gap-4 p-1 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:max-w-1/3">
            <EventSearchBox placeholder="Search by title & venue ..." />
          </div>
          <div className="flex items-center gap-4">
            <EventFilters />
          </div>
        </div>
      </div>
      <div
        className={cn('flex flex-col gap-4', {
          'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3': viewMode == 'grid',
        })}
      >
        {events.length > 0 ? (
          events.map(event => <EventCard key={event.id} event={event} />)
        ) : (
          <p>No events found</p>
        )}
      </div>
    </div>
  );
};

export default EventsListPage;
