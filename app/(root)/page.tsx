import React from 'react';
import ReadingChallenge from '@/components/book/ReadingChallenge';
import BookStatusCard from '@/components/book/BookStatusCard';
import Feed from '@/components/user/Feed';
import { getCurrentUser } from '@/lib/actions/user.actions';

import { getUserActivity, getUserFeed } from '@/lib/actions/book.actions';
import { Book } from '@/types';

const Home = async () => {
  const user = await getCurrentUser();
  const response = await getUserFeed({ userId: user.$id });
  const bookActivity = response.feed.map((feedItem) => ({
    ...feedItem,
    books: feedItem.books.filter((book): book is Book => book !== null),
  }));

  const count = bookActivity
    .filter((feedItem) => feedItem.userId === user.$id)
    .flatMap((feedItem) => feedItem.books)
    .filter((book) => book.status === 'Read').length;

  const [currentlyReadingBooks, readBooks, wantToReadBooks] = await Promise.all(
    [
      getUserActivity({
        userId: user.$id,
        status: 'CurrentlyReading',
      }),
      getUserActivity({
        userId: user.$id,
        status: 'Read',
      }),
      getUserActivity({
        userId: user.$id,
        status: 'WantToRead',
      }),
    ]
  );

  return (
    <section className="flex mb-12 mt-36 ml-24">
      <Feed feed={bookActivity} user={user} />
      <div className="flex flex-col h-full sticky max-w-[340px] w-full mx-6">
        <ReadingChallenge
          userId={user.$id}
          goal={user.readingGoal}
          readBookCount={count!}
        />
        <BookStatusCard
          title="Currently Reading"
          books={currentlyReadingBooks.books.filter(
            (book): book is Book => book !== null
          )}
        />
        <BookStatusCard
          title="Want To Read"
          books={wantToReadBooks.books.filter(
            (book): book is Book => book !== null
          )}
        />
        <BookStatusCard
          title="Read"
          books={readBooks.books.filter((book): book is Book => book !== null)}
        />
      </div>
    </section>
  );
};

export default Home;
