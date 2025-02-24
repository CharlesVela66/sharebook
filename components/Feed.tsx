import React from 'react';
import BookCard from './BookCard';
import { cn } from '@/lib/utils';
import { Book, User } from '@/types';

const Feed = async ({
  feed,
  className,
  user,
}: {
  feed: any;
  className?: string;
  user: User;
}) => {
  return (
    <>
      {feed.length > 0 ? (
        <div className={cn('flex flex-col w-full', className)}>
          {feed.map((book: Book) => (
            <BookCard key={book.id} book={book} user={user} type="feed" />
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
