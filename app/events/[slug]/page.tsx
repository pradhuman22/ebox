import React from 'react';
import { prisma } from '@/prisma/client';
import EventDetailCard from '../_components/EventDetailCard';
import { Metadata } from 'next';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const EventDetailPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const event = await prisma.event.findFirst({
    where: { slug },
    include: {
      category: true,
      host: true,
      tickets: true,
    },
  });
  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-20 md:px-16">
      {!event ? <div>Event not found.</div> : <EventDetailCard event={event} />}
    </div>
  );
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findFirst({ where: { slug } });

  return {
    title: event?.title,
    description: event?.description,
  };
}

export const dynamic = 'force-dynamic';

export default EventDetailPage;
