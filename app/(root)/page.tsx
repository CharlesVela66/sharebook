import BookCard from '@/components/BookCard';
import React from 'react';
import { books } from '@/constants';
import ReadingChallenge from '@/components/ReadingChallenge';
import CurrentlyReading from '@/components/CurrentlyReading';
import WantToRead from '@/components/WantToRead';
import ToRead from '@/components/ToRead';

const Home = () => {
  return (
    <section className="flex my-12">
      <div className="flex flex-col w-full items-center justify-center ml-16">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      <div className="flex flex-col h-full sticky bg-white max-w-[440px] w-full mx-6">
        <ReadingChallenge />
        <CurrentlyReading />
        <WantToRead />
        <ToRead />
      </div>
    </section>
  );
};

export default Home;
