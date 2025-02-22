import React from 'react';
import BookCard from './BookCard';
import { cn } from '@/lib/utils';
import { Book } from '@/types';

const Feed = async ({ feed, className }: { feed: any; className?: string }) => {
  return (
    <>
      {feed.length > 0 ? (
        <div className={cn('flex flex-col w-full', className)}>
          {feed.map((book: Book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="w-full">
          There hasn&apos;t been an update neither from you nor your friends!
        </div>
      )}
    </>
  );
};

export default Feed;
