import { Book } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BookStatusCard = ({ title, books }: { title: string; books: Book[] }) => {
  return (
    <>
      <h3 className="font-semibold text-[20px] my-2">{title}</h3>
      <div className="max-w-[820px] bg-white rounded-3xl mb-8 shadow-lg h-[220px] flex items-center justify-center gap-3 p-4 overflow-x-auto">
        {books && books.length > 0 ? (
          books.map((book) => (
            <Link
              key={book.id}
              href={`/book/${book.id}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                src={book.thumbnail || '/icons/book-open.svg'}
                alt={book.title}
                width={110}
                height={140}
                className="rounded-md object-cover flex-shrink-0"
              />
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No books in this category yet
          </p>
        )}
      </div>
    </>
  );
};

export default BookStatusCard;
