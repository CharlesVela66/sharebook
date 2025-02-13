'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { useDebounce } from 'use-debounce';

import { books } from '@/constants';

const Search = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Book[]>([]);
  const [open, setOpen] = useState(false);
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    const fetchBooks = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        setOpen(false);
        return;
      }
      const filteredBooks = books.filter(
        (book) =>
          book.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      setResults(filteredBooks);
      setOpen(true);
      console.log(query);
      console.log(results);
    };
    fetchBooks();
  }, [debouncedQuery]);

  return (
    <div className="relative w-full md:max-w-[730px] mt-3 pl-8">
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
        />
        {open && (
          <ul className="absoulte left-0 z-50 flex w-full flex-col gap-3 rounded-[20px] bg-white p-4 shadow-md">
            {results.length > 0 ? (
              results.map((book) => (
                <li key={book.id} className="flex items-center justify-between">
                  <div className="flex cursor-pointer items-center gap-4">
                    <Image
                      src={book.coverImage}
                      alt={book.name}
                      width={32}
                      height={32}
                      className="rounded-md"
                    />
                    <div className="flex flex-col">
                      <p className="text-[16px] text-black font-normal">
                        {book.name}
                      </p>
                      <p className="text-[12px] italic text-dark-200">
                        by{' '}
                        <span className="text-dark-300 font-light">
                          {book.author}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mx-2">
                    <Image
                      src="/icons/star.svg"
                      alt="star"
                      width={20}
                      height={20}
                    />
                    <p>{book.rating.toFixed(2)}</p>
                  </div>
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
