'use client';

import { ArrowUpDownIcon } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface DataTableSortableHeaderProps {
  field: string;
  title: string;
}

export function DataTableSortableHeader({ field, title }: DataTableSortableHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div
      className="flex cursor-pointer items-center text-left font-bold"
      onClick={() => {
        const params = new URLSearchParams(searchParams);
        const currentSort = searchParams.get('sort');
        const isAsc = currentSort === `${field}.asc`;
        params.set('sort', isAsc ? `${field}.desc` : `${field}.asc`);
        router.push(`${pathname}?${params.toString()}`);
      }}
    >
      {title} <ArrowUpDownIcon className="ml-2 h-4 w-4" />
    </div>
  );
}
