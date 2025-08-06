import { Loader2Icon } from 'lucide-react';
import React from 'react';

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center py-56">
      <Loader2Icon className="animate-spin" />
    </div>
  );
};

export default LoadingPage;
