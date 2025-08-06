'use client';
import React, { useMemo, useState } from 'react';
import { Category, Event, Ticket } from '@/prisma/generated/prisma';
import Image from 'next/image';
import { User } from 'better-auth';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, ClockIcon, MapPin, TicketIcon } from 'lucide-react';
import { formatEventDate, formatPrice } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const EventDetailCard = ({
  event,
}: {
  event?: (Event & { category: Category | null; host: User | null; tickets: Ticket[] }) | null;
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | undefined>(
    event?.tickets[0]?.id,
  );
  const selectedTicket = useMemo(() => {
    return event?.tickets.find(t => t.id === selectedTicketId);
  }, [event, selectedTicketId]);
  if (!event) {
    notFound();
  }
  return (
    <div className="grid gap-8 md:grid-cols-5 lg:gap-12">
      <div className="md:col-span-3">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-lg md:aspect-video">
          <Carousel className="group overflow-hidden rounded-lg shadow-lg">
            <CarouselContent>
              {event.images.map((image, idx) => (
                <CarouselItem key={idx}>
                  <div className="relative aspect-[16/10] md:aspect-video">
                    <Image
                      src={image}
                      alt={`${event.title} image ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100" />
            <CarouselNext className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100" />
          </Carousel>
        </div>
        <Tabs defaultValue="description" className="mt-6">
          <TabsList>
            <TabsTrigger value="description" className="cursor-pointer">
              Description
            </TabsTrigger>
            <TabsTrigger value="location" className="cursor-pointer">
              Location
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="text-foreground/80 mt-4 leading-relaxed">
            <p>{event.description}</p>
          </TabsContent>
          <TabsContent value="location" className="text-foreground/80 mt-4 leading-relaxed">
            <div className="aspect-video w-full overflow-hidden rounded-lg border">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(event.venue)}`}
              ></iframe>
            </div>
          </TabsContent>
        </Tabs>
        <Separator className="my-8" />
      </div>
      <div className="md:col-span-2">
        <Card className="sticky top-20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl capitalize md:text-2xl">{event.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm md:text-base">
            <div className="flex items-start gap-4">
              <CalendarIcon className="text-primary mt-1 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Date and Time</p>
                <p className="text-muted-foreground">
                  {formatEventDate(event.schedule, 'en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <ClockIcon className="text-primary mt-1 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Time</p>
                <p className="text-muted-foreground">
                  {formatEventDate(event.schedule, 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="text-primary mt-1 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Location</p>
                <p className="text-muted-foreground">{event.venue}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                <TicketIcon className="text-primary h-5 w-5" />
                Tickets
              </h3>
              {event.tickets.length > 0 ? (
                <div className="space-y-4">
                  <Select onValueChange={setSelectedTicketId} defaultValue={selectedTicketId}>
                    <SelectTrigger className="w-full uppercase">
                      <SelectValue placeholder="Select Ticket Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {event.tickets.map(ticket => (
                        <SelectItem className="uppercase" key={ticket.id} value={ticket.id}>
                          {ticket.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTicket && (
                    <div className="bg-background flex flex-col items-start justify-between gap-2 rounded-md py-3 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-base font-bold capitalize">{selectedTicket.type}</p>
                        <p className="text-muted-foreground text-base">Resale Ticket</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-primary text-base font-bold">
                          {formatPrice(Number(selectedTicket.price), 'JPY')}
                        </p>
                        <Button size="sm" className="mt-1 cursor-pointer">
                          Purchase Ticket
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Tickets Not Listed</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetailCard;
