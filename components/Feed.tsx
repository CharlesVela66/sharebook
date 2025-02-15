import React from 'react';
import BookCard from './BookCard';
import { books } from '@/constants';
import { cn } from '@/lib/utils';

const Feed = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex flex-col w-full', className)}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default Feed;
