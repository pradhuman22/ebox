'use client';
import React from 'react';
import { FilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter, useSearchParams } from 'next/navigation';
const EventSortFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortValue, setSortValue] = React.useState(searchParams.get('sort') || '');
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortValue) {
      params.set('sort', sortValue);
    } else {
      params.delete('sort');
    }
    router.push(`/events?${params.toString()}`);
  }, [sortValue, router, searchParams]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <FilterIcon className="h-4 w-4" />
          <span className="sr-only">Sort By</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sortValue} onValueChange={setSortValue}>
          <DropdownMenuRadioItem value="schedule-asc">Date (Upcoming)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="schedule-desc">Date (Past)</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EventSortFilter;
