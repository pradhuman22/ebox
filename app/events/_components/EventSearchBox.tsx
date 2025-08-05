'use client';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface SearchInputProps {
  placeholder?: string;
}

const EventSearchBox = ({ placeholder = 'Search ...' }: SearchInputProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('keyword') || '';
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedQuery) {
      params.set('keyword', debouncedQuery);
    } else {
      params.delete('keyword');
    }

    router.push(`/events?${params.toString()}`);
  }, [debouncedQuery, router, searchParams]);
  return (
    <div className="relative w-full">
      <SearchIcon className="text-muted-foreground absolute top-1/3 left-2.5 h-4 w-4" />
      <Input
        type="search"
        placeholder={placeholder}
        className="w-full pl-8"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
    </div>
  );
};

export default EventSearchBox;
