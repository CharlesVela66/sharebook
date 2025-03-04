'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { useDebounce } from 'use-debounce';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Book } from '@/types';
import { getBooksBySearchTerm } from '@/lib/actions/book.actions';

const Search = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Book[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      if (debouncedQuery.length < 3) {
        setResults([]);
        setOpen(false);
        setError('');
        return;
      }
      try {
        setLoading(true);
        setError('');
        const response = await getBooksBySearchTerm({
          searchTerm: debouncedQuery,
        });

        if (!response.success) {
          throw new Error('Failed to fetch the books by search term');
        }

        setResults(response.books!);
        setOpen(true);
      } catch (error) {
        setError('Failed to fetch books. Please try again.');
        console.error(error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
    if (e.key === 'Enter' && query.length >= 3) {
      e.preventDefault();
      setOpen(false);
      router.push(`/search/${encodeURIComponent(query)}`);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full md:max-w-[730px] mt-3 pl-8">
      <div className="relative h-[52px] ">
        <Image
          src="/icons/search.svg"
          alt="search"
          width={20}
          height={20}
          className="absolute left-4 top-6 -translate-y-1/2 z-10"
        />
        <Input
          type="text"
          placeholder="Search Books..."
          className="h-[50px] rounded-2xl shadow-md font-light pl-12"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {loading && (
          <Loader2 className="absolute right-4 top-6 -translate-y-1/2 animate-spin text-gray-400" />
        )}

        {error && (
          <p id="search-error" className="text-red-500 text-sm mt-2">
            {error}
          </p>
        )}

        {open && (
          <ul
            className="absolute left-0 z-50 w-full flex flex-col gap-3 rounded-[20px] bg-white p-4 shadow-md max-h-[400px] overflow-y-auto"
            id="search-results"
          >
            {results.length > 0 ? (
              results.map((book) => (
                <li key={book.id} className="flex items-center justify-between">
                  <Link
                    href={`/book/${book.id}`}
                    className="flex cursor-pointer items-center gap-4"
                  >
                    <Image
                      src={book.thumbnail || '/icons/book-open.svg'}
                      alt={book.title || 'book'}
                      width={32}
                      height={32}
                      className="rounded-md"
                    />
                    <div className="flex flex-col">
                      <p className="text-[16px] text-black font-normal">
                        {book.title}
                      </p>
                      <p className="text-[12px] italic text-dark-200">
                        by{' '}
                        <span className="text-dark-300 font-light">
                          {book.authors?.join(', ')}
                        </span>
                      </p>
                    </div>
                  </Link>
                  {book.averageRating > 0 && (
                    <div className="flex gap-2 mx-2 items-center">
                      <Image
                        src="/icons/star.svg"
                        alt=""
                        width={20}
                        height={20}
                      />
                      <p className="min-w-[40px]">
                        {book.averageRating.toFixed(1)}
                      </p>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p className="text-[14px] text-black font-light">
                No books found
              </p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
