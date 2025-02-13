import BookCard from '@/components/BookCard';
import React from 'react';
import { books } from '@/constants';
import ReadingChallenge from '@/components/ReadingChallenge';
import CurrentlyReading from '@/components/CurrentlyReading';
import WantToRead from '@/components/WantToRead';
import ToRead from '@/components/ToRead';

const Home = () => {
  return (
    <section className="flex my-12 ml-12 gap-4 justify-between">
      <div className="flex flex-col">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      <div className="flex flex-col h-full sticky bg-white">
        <ReadingChallenge />
        <CurrentlyReading />
        <WantToRead />
        <ToRead />
      </div>
    </section>
  );
};

export default Home;
