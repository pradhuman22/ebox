import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';

const NewsletterForm = () => {
  return (
    <div className="w-full space-y-1.5 lg:px-4">
      <h3 className="text-lg font-semibold uppercase">Get the latest updates</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        Stay informed about upcoming events, and exclusive offers.
      </p>
      <div className="flex gap-3">
        <Input
          placeholder="Enter your email to subscribe"
          className="border-foreground/50 w-full"
        />
        <Button>Subscribe</Button>
      </div>
    </div>
  );
};

export default NewsletterForm;
