'use client';
import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatEventDate } from '@/lib/utils';
import { CalendarDaysIcon, MapPinIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Category, Event } from '@/prisma/generated/prisma';
import { User } from 'better-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const EventCard = ({
  event,
}: {
  event: Event & {
    category: Category | null;
    host: User | null;
  };
}) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/events/${event.slug}`);
  };
  return (
    <Card className="group bg-background relative cursor-pointer overflow-hidden rounded-lg border p-0 shadow transition-colors">
      <Carousel className="relative">
        <CarouselContent>
          {event.images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative flex aspect-[3/2] items-center justify-center overflow-hidden p-6">
                <Image
                  src={image || '/placeholder.svg'}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  priority
                  quality={90}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100" />
        <CarouselNext className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100" />
      </Carousel>

      <CardContent className="p-4">
        <div>
          <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>{formatEventDate(event.schedule)}</span>
            <Badge
              variant={'default'}
              className="bg-muted text-muted-foreground ml-auto text-xs font-bold"
            >
              {event.category?.name}
            </Badge>
          </div>
          <h3 className="line-clamp-1 font-semibold capitalize">{event.title}</h3>
          <p className="text-muted-foreground mt-1 mb-2 line-clamp-1 text-sm">
            {event.description}
          </p>
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={event.host?.image || ''} alt={event.host?.name || 'user'} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <p className="text-muted-foreground/80 text-sm font-semibold">By {event.host?.name}</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <MapPinIcon className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground line-clamp-1 text-sm">{event.venue}</span>
            </div>
            <div className="text-sm font-bold" onClick={handleClick}>
              View Details..
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
