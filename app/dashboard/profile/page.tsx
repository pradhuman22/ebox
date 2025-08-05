import React from 'react';
import { headers } from 'next/headers';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProfileForm from './_components/ProfileForm';

const ProfilePage = async () => {
  const headerList = await headers();
  const session = await auth.api.getSession({
    headers: headerList,
  });
  if (!session) redirect('/login');
  return (
    <div className="container mx-auto max-w-screen-xl space-y-2.5 px-4 pt-7 pb-14 md:px-16">
      <ProfileForm user={session.user} />
    </div>
  );
};

export default ProfilePage;
