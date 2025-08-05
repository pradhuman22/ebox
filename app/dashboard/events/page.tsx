import React from 'react';
import { DataTable } from '@/components/data-table';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getEventsListByCurrentUser } from '../actions/event';
import { EventColumns } from './_components/EventColumns';

const EventsListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; sort?: string }>;
}) => {
  const headerList = await headers();
  const session = await auth.api.getSession({
    headers: headerList,
  });
  if (!session?.user?.id) {
    return redirect('/login');
  }
  const params = await searchParams;

  const page = params.page ? parseInt(params.page) : 1;
  const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;

  // Parse sorting parameters
  const sorting = params.sort
    ? [
        {
          id: params.sort.split('.')[0],
          desc: params.sort.split('.')[1] === 'desc',
        },
      ]
    : [];

  try {
    const { data, pageCount } = await getEventsListByCurrentUser({
      id: session.user.id,
      page,
      pageSize,
      sorting,
    });
    return (
      <div className="container mx-auto max-w-screen-xl space-y-2.5 px-4 py-8 md:px-16">
        <div className="flex items-center justify-between">
          <div className="space-x-1.5">
            <h1 className="text-2xl font-bold">Hosted Events</h1>
            <p className="text-muted-foreground">View and manage all the events you have hosted.</p>
          </div>
        </div>
        <DataTable
          columns={EventColumns}
          data={data}
          pageCount={pageCount}
          pageSize={pageSize}
          currentPage={page}
        />
      </div>
    );
  } catch (error) {
    throw error;
  }
};

export default EventsListPage;
