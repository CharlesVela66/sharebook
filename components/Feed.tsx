import React from 'react';
import BookCard from './BookCard';
import { books } from '@/constants';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { getUserFeed } from '@/lib/actions/book.actions';

const Feed = async ({
  user,
  className,
}: {
  user: User;
  className?: string;
}) => {
  const feed = await getUserFeed({ userId: user.$id });

  console.log(feed);

  return (
    <>
      {feed ? (
        <div className={cn('flex flex-col w-full', className)}>
          {books.map((book) => (
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
