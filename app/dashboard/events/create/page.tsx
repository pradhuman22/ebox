import React from 'react';
import EventForm from '../_components/EventForm';
import { getCategories } from '../../actions/event';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

const CreateEventPage = async () => {
  const categories = await getCategories();
  return (
    <div className="container mx-auto max-w-screen-xl space-y-8 px-4 py-10 md:px-16">
      <div className="flex items-center justify-between">
        <div className="space-x-1.5">
          <h1 className="text-2xl font-bold">Host Your Event</h1>
          <p className="text-muted-foreground">List your event in a few simple steps.</p>
        </div>
        <Button asChild variant={'link'}>
          <Link href={'/dashboard/events'}>
            <ArrowLeftIcon />
            Go Back To Events
          </Link>
        </Button>
      </div>
      <EventForm categories={categories} />
    </div>
  );
};

export default CreateEventPage;
