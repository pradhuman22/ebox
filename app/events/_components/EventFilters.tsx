import { prisma } from '@/prisma/client';
import EventCategoryFilter from './EventCategoryFilter';
import EventSortFilter from './EventSortFilter';

const EventFilters = async () => {
  const categories = await prisma.category.findMany();
  return (
    <div className="flex h-12 items-center gap-2">
      <EventCategoryFilter categories={categories} />
      <EventSortFilter />
    </div>
  );
};

export default EventFilters;
