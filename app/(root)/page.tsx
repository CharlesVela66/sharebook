import React from 'react';
import { books } from '@/constants';
import ReadingChallenge from '@/components/ReadingChallenge';
import BookStatusCard from '@/components/BookStatusCard';
import Feed from '@/components/Feed';

const Home = () => {
  const currentlyReadingBooks = books.filter(
    (book) => book.id === 1 || book.id === 2
  );
  const readBooks = books.filter((book) => book.id === 2);
  const wantToReadBooks = books.filter((book) => book.id === 3);

  return (
    <section className="flex mb-12 mt-36 ml-32">
      <Feed />
      <div className="flex flex-col h-full sticky max-w-[340px] w-full mx-6">
        <ReadingChallenge />
        <BookStatusCard
          title="Currently Reading"
          books={currentlyReadingBooks}
        />
        <BookStatusCard title="Want To Read" books={wantToReadBooks} />
        <BookStatusCard title="Read" books={readBooks} />
      </div>
    </section>
  );
};

export default Home;
