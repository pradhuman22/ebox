'use client';
import { authClient } from '@/auth-client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  BookTextIcon,
  CalendarPlusIcon,
  CalendarRange,
  CircleQuestionMark,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  PartyPopperIcon,
  TicketCheckIcon,
  TicketsIcon,
  UserCogIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

const UserButton = () => {
  const router = useRouter();
  const { data } = authClient.useSession();
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('You’ve logged out. See you soon!', {
            style: {
              color: 'green',
            },
          });
          router.push('/login');
          router.refresh();
        },
        onError: ctx => {
          toast.error(ctx.error.message);
        },
      },
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer rounded-full">
        <Button size={'icon'}>
          <MenuIcon className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 rounded-[0.5rem]">
        <DropdownMenuLabel
          className={cn({
            hidden: !data?.session,
          })}
        >
          <div>
            <h3 className="text-base font-semibold">{data?.user.name}</h3>
            <p className="text-sm">{data?.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator
          className={cn({
            hidden: !data?.session,
          })}
        />
        <DropdownMenuGroup
          className={cn({
            hidden: !data?.session,
          })}
        >
          <DropdownMenuItem asChild className="cursor-pointer rounded-none">
            <Link href={'/dashboard/profile'}>
              <UserCogIcon />
              Profile Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer rounded-none">
            <Link href={'/dashboard/events'}>
              <CalendarRange />
              Events List
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer rounded-none">
            <Link href={'/dashboard/tickets'}>
              <TicketsIcon />
              Tickets List
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuItem asChild className="cursor-pointer rounded-none">
          <Link href={'/dashboard/events/create'}>
            <CalendarPlusIcon />
            Become a host
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer rounded-none">
          <Link href={'/contact-us'}>
            <CircleQuestionMark />
            Help Center
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer rounded-none md:hidden">
          <Link href={'/events'}>
            <PartyPopperIcon />
            Browse Events
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className={cn('cursor-pointer rounded-none', {
            hidden: !data?.session,
          })}
        >
          <Link href={'/dashboard/events'}>
            <TicketCheckIcon />
            Verify Event Ticket
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer rounded-none">
          <Link href={'/how-it-works'}>
            <BookTextIcon />
            How It Works?
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className={cn('cursor-pointer rounded-none', {
            hidden: data?.session,
          })}
        >
          <Link href={'/login'}>
            <LogInIcon />
            Log in or sign up
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className={cn('cursor-pointer rounded-none', {
            hidden: !data?.session,
          })}
        >
          <LogOutIcon />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
