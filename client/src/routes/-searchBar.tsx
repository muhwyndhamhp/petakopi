import useSWR from 'swr';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { client, rpcFetch } from '@fetcher/fetcher.ts';
import { useAppStore } from '@store/store.ts';

export function SearchBar() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');

  const setSearchResult = useAppStore((state) => state.setSearchResult);
  const clearSearch = useAppStore((state) => state.clearSearchResult);

  // Move focusHandler inside component and memoize
  const focusHandler = useCallback(() => {
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

        if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          const searchInput = document.getElementById('search-bar') as HTMLInputElement | null;
          if (searchInput) {
            searchInput.focus();
          }
        }
      };

      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }, []);
  }, []);

  focusHandler();

  // Memoize the debounced query update
  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery(input.trim());
    }, 200);

    return () => clearTimeout(timeout);
  }, [input]);

  // Memoize search conditions and API call
  const shouldSearch = useMemo(() => query !== '', [query]);
  
  const { data } = useSWR(
    shouldSearch ? ['searchBar', query] : null,
    () =>
      rpcFetch(client.api.coffees.search.$get)({
        query: {
          q: query !== '' ? query : undefined,
        },
      })()
    ,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 30000, // 30 seconds for search
    },
  );

  // Memoize store updates to prevent unnecessary re-renders
  useEffect(() => {
    if (!shouldSearch) {
      clearSearch();
    }
  }, [shouldSearch, clearSearch]);

  useEffect(() => {
    if (data) {
      setSearchResult(data);
    }
  }, [data, setSearchResult]);

  // Memoize the input handler
  const handleInputChange = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  }, []);

  return (
    <label className="w-full drop-shadow-2xl input input-lg">
      <svg className="opacity-50 h-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
      <input 
        id="search-bar" 
        type="search" 
        className="grow" 
        placeholder="Search" 
        onKeyUp={handleInputChange} 
      />
      <kbd className="kbd kbd-sm">⌘</kbd>
      <kbd className="kbd kbd-sm">K</kbd>
    </label>
  );
}