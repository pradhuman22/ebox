'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditIcon, JapaneseYenIcon, MoreHorizontalIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { deleteEventAction } from '../../actions/event';

const EventActions = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const handleDelete = () => {
    startTransition(async () => {
      const response = await deleteEventAction(slug);
      if (!response.success) {
        toast.error(response.message, {
          style: { color: 'red' },
        });
      }
      if (response.success) {
        toast.success(response.message, {
          style: { color: 'green' },
        });
        router.refresh();
      }
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="h-8 w-8 cursor-pointer p-0">
        <Button variant={'ghost'}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem asChild className="cursor-pointer text-blue-500">
          <Link href={`/dashboard/events/${slug}/sales`}>
            <JapaneseYenIcon className="stroke-blue-500" /> Sales
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer text-green-500">
          <Link href={`/dashboard/events/${slug}/edit`}>
            <EditIcon className="stroke-green-500" /> Edit
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer text-red-500"
          onClick={handleDelete}
          disabled={isPending}
        >
          <TrashIcon className="stroke-red-500" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EventActions;
