import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmailVerifiedPage = () => {
  return (
    <div className="flex items-center justify-center pt-40 lg:pt-64">
      <div className="flex flex-col items-center justify-center gap-4">
        <h3 className="text-xl font-semibold">🎉 Email Verified Successfully!</h3>
        <p className="text-primary text-center">
          Thank you for verifying your email. Your account is now active, and you can start using
          all the features.
        </p>
        <Button asChild className="group relative flex items-center gap-2">
          <Link href={'/'}>
            <ArrowLeftIcon size={16} className="group-hover:-translate-x-0.5" />
            <span>Return To Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default EmailVerifiedPage;
