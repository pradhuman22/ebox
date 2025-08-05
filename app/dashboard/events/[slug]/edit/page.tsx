import React from 'react';
import { getCategories } from '@/app/dashboard/actions/event';
import { prisma } from '@/prisma/client';
import EventForm from '../../_components/EventForm';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

const EventEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const event = await prisma.event.findFirst({
    where: {
      id,
    },
    include: {
      tickets: true,
    },
  });
  const categories = await getCategories();

  if (!event) {
    return notFound();
  }
  return (
    <div className="container mx-auto max-w-screen-xl space-y-8 px-4 py-10 md:px-16">
      <div className="flex items-center justify-between">
        <div className="space-x-1.5">
          <h1 className="text-2xl font-bold">Edit Your Host Event</h1>
          <p className="text-muted-foreground">
            Make changes to your event details to ensure it's up-to-date and appealing to attendees.
          </p>
        </div>
        <Button asChild variant={'link'}>
          <Link href={'/dashboard/events'}>
            <ArrowLeftIcon />
            Go Back To Events
          </Link>
        </Button>
      </div>
      <EventForm categories={categories} event={event} />
    </div>
  );
};

export default EventEditPage;
