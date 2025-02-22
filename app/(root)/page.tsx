import React from 'react';
import ReadingChallenge from '@/components/ReadingChallenge';
import BookStatusCard from '@/components/BookStatusCard';
import Feed from '@/components/Feed';
import { getCurrentUser } from '@/lib/actions/user.actions';
import {
  getUserBookActivity,
  getUserBooksByStatus,
} from '@/lib/actions/book.actions';
import { transformDocumentListToBooks } from '@/lib/utils';

const Home = async () => {
  const user = await getCurrentUser();
  const bookActivity = await getUserBookActivity({ userId: user.$id });
  const count = bookActivity?.length;

  const [currentlyReadingBooks, readBooks, wantToReadBooks] = await Promise.all(
    [
      getUserBooksByStatus({
        userId: user.$id,
        bookStatus: 'CurrentlyReading',
      }),
      getUserBooksByStatus({
        userId: user.$id,
        bookStatus: 'Read',
      }),
      getUserBooksByStatus({
        userId: user.$id,
        bookStatus: 'WantToRead',
      }),
    ]
  );

  return (
    <section className="flex mb-12 mt-36 ml-24">
      <Feed feed={bookActivity} />
      <div className="flex flex-col h-full sticky max-w-[340px] w-full mx-6">
        <ReadingChallenge
          userId={user.$id}
          goal={user.readingGoal}
          readBookCount={count!}
        />
        <BookStatusCard
          title="Currently Reading"
          books={transformDocumentListToBooks(currentlyReadingBooks)}
        />
        <BookStatusCard
          title="Want To Read"
          books={transformDocumentListToBooks(wantToReadBooks)}
        />
        <BookStatusCard
          title="Read"
          books={transformDocumentListToBooks(readBooks)}
        />
      </div>
    </section>
  );
};

export default Home;
