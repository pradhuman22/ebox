'use server';
import { deleteImageFromCloudinaryAction } from '@/lib/upload';
import * as z from 'zod';
import { prisma } from '@/prisma/client';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { eventSchema } from '@/schema/eventSchema';
import { SortingState } from '@tanstack/react-table';
import { User } from 'better-auth';

export type EventsQueryParams = {
  id: User['id'];
  page?: number;
  pageSize?: number;
  sorting?: SortingState;
};

export const getCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
      order: 'asc',
    },
  });
};

export const getEventsListByCurrentUser = async ({
  id,
  page = 1,
  pageSize = 10,
  sorting = [],
}: EventsQueryParams) => {
  try {
    if (!id) {
      throw new Error('User ID is required');
    }

    const skip = (page - 1) * pageSize;

    // Build orderBy object based on sorting state
    const orderBy: { [key: string]: 'asc' | 'desc' }[] =
      sorting?.map(sort => ({
        [sort.id]: sort.desc ? ('desc' as const) : ('asc' as const),
      })) ?? [];

    // Directly fetch from database to ensure fresh data
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: { hostId: id },
        skip,
        take: pageSize,
        orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: 'desc' }],
        include: {
          category: true,
          host: true,
          tickets: true,
        },
      }),
      prisma.event.count({
        where: { hostId: id },
      }),
    ]);

    return {
      data: events,
      pageCount: Math.ceil(total / pageSize),
      total,
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }
};

export const createEventAction = async (values: z.infer<typeof eventSchema>) => {
  try {
    const headerList = await headers();
    const session = await auth.api.getSession({
      headers: headerList,
    });
    if (!session?.user) {
      return {
        success: false,
        message: 'User authentication failed.',
      };
    }
    const { success, data } = eventSchema.safeParse(values);

    if (!success) {
      return {
        success: false,
        message: 'Invalid event date',
      };
    }
    const combinedDateTime = new Date(data.date);
    const [hours, minutes] = data.time.split(':').map(Number);
    combinedDateTime.setHours(hours, minutes);
    const newEvent = await prisma.event.create({
      data: {
        title: data.title.toLowerCase(),
        slug: slugify(data.title),
        description: data.description,
        venue: data.venue,
        capacity: data.capacity,
        schedule: combinedDateTime,
        status: data.status,
        images: data.images,
        tickets: {
          createMany: {
            data: data.tickets,
          },
        },
        category: {
          connect: {
            id: data.categoryId,
          },
        },
        host: {
          connect: {
            id: session?.user?.id,
          },
        },
      },
    });
    if (newEvent) {
      return {
        success: true,
        message: `${newEvent.title} is created successfully.`,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'Internal server error.',
    };
  }
};

export const updateEventAction = async (slug: string, values: z.infer<typeof eventSchema>) => {
  try {
    /** check session expire  or not */
    const headerList = await headers();
    const session = await auth.api.getSession({
      headers: headerList,
    });
    if (!session?.user) {
      return {
        success: false,
        message: 'User authentication failed.',
      };
    }
    const { success } = eventSchema.safeParse(values);
    /** check event exist or not */
    if (!success) {
      return {
        success: false,
        message: 'Invalid event data',
      };
    }
    /** check event is available or not */
    const event = await prisma.event.findFirst({
      where: {
        slug,
      },
    });
    if (!event) {
      return {
        success: false,
        message: 'Event not found',
      };
    }
    if (event.hostId !== session?.user.id) {
      return {
        success: false,
        message: 'Invalid User Update',
      };
    }
    const { tickets, categoryId, title, date, time, description, venue, status, images, capacity } =
      values;
    const combinedDateTime = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    combinedDateTime.setHours(hours, minutes);
    const updateEvent = await prisma.event.update({
      where: { id: event.id },
      data: {
        title,
        description,
        venue,
        status,
        images,
        capacity,
        schedule: combinedDateTime,
        tickets: {
          deleteMany: {},
          createMany: { data: tickets },
        },
        category: {
          connect: {
            id: categoryId,
          },
        },
        host: {
          connect: {
            id: session?.user.id,
          },
        },
      },
    });
    if (!updateEvent) {
      return {
        success: false,
        message: 'Failed to update.',
      };
    }
    return {
      success: true,
      message: `${event.title} is updated successfully.`,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'Internal server error',
    };
  }
};

export const deleteEventAction = async (slug: string) => {
  try {
    /** check session expire  or not */
    const headerList = await headers();
    const session = await auth.api.getSession({
      headers: headerList,
    });
    if (!session?.user) {
      return {
        success: false,
        message: 'User authentication failed.',
      };
    }
    const event = await prisma.event.findFirst({
      where: {
        slug: slug,
        host: {
          id: session?.user?.id,
        },
      },
    });
    if (!event) {
      return {
        success: false,
        message: `Events not found.`,
      };
    }

    event.images.map(async image => await deleteImageFromCloudinaryAction(image));

    const deleteEvent = await prisma.event.delete({
      where: {
        id: event.id,
      },
    });
    if (!deleteEvent) {
      return {
        success: false,
        message: 'Failed to delete the events',
      };
    }
    return {
      success: true,
      message: `${event.title} is deleted successfully`,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'Internal server error',
    };
  }
};

export const getUpcomingEvents = async () => {
  const now = new Date();
  // Set time to start of today
  now.setHours(0, 0, 0, 0);

  const events = await prisma.event.findMany({
    where: {
      status: 'Published',
      schedule: {
        gte: now,
      },
    },
    include: {
      category: true,
      host: true,
      tickets: true,
    },
    orderBy: {
      schedule: 'asc',
    },
    take: 6,
  });
  return events;
};

const slugify = (title: string) => {
  // Convert to lowercase
  let slug = title.toLowerCase();

  // Replace spaces with hyphens
  slug = slug.replace(/\s+/g, '-');

  // Remove all non-word characters (except hyphens)
  slug = slug.replace(/[^\w-]+/g, '');

  // Replace multiple hyphens with a single hyphen
  slug = slug.replace(/--+/g, '-');

  // Trim leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '');

  return slug;
};
