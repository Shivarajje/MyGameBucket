'use client';

import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SearchSuggestions } from './SearchSuggestions';
import { useGameSearch } from '@/features/games/hooks/useGameSearch';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { results, loading } = useGameSearch(query);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleSelect() {
    setIsFocused(false);
    setQuery('');
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-muted-foreground" />
        </div>
        <Input
          type="search"
          placeholder="Search games..."
          className="w-full pl-10 pr-4 rounded-full bg-secondary/50 border-transparent focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
      </form>

      {isFocused && query.trim().length > 0 && (
        <SearchSuggestions 
          query={query} 
          results={results} 
          loading={loading} 
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}
