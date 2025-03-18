import React from 'react';
import BookCard from '../book/BookCard';
import { cn } from '@/lib/utils';
import { Feed as FeedType, UserCardProps } from '@/types';
import { getCurrentUser } from '@/lib/actions/user.actions';

const Feed = async ({
  feed,
  className,
}: {
  feed: FeedType[];
  className?: string;
  user: UserCardProps;
}) => {
  const user = await getCurrentUser();
  return (
    <>
      {feed.length > 0 ? (
        <div className={cn('flex flex-col w-full', className)}>
          {feed.map((feedItem: FeedType) => {
            const feedUser = {
              $id: feedItem.userId,
              name: feedItem.userName || 'User',
              profilePic: feedItem.userProfilePic || '/images/profile-pic.png',
            };

            return feedItem.books.map((book) => (
              <BookCard
                key={`${feedItem.userId}-${book.id}`}
                book={book}
                user={feedUser}
                currentUser={user}
                type="feed"
              />
            ));
          })}
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
