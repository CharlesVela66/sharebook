import Image from 'next/image';
import React from 'react';

interface BookStatusCardProps {
  title: string;
  books: Book[];
}

const BookStatusCard = ({ title, books }: BookStatusCardProps) => {
  return (
    <>
      <h3 className="font-semibold text-[20px] my-2 ">{title}</h3>
      <div className="max-w-[820px] bg-white rounded-3xl mb-8 shadow-lg h-[220px] flex items-center justify-center gap-3">
        {books.map((book) => (
          <Image
            key={book.id}
            src={book.coverImage}
            alt={book.name}
            width={110}
            height={140}
            className="rounded-md"
          />
        ))}
      </div>
    </>
  );
};

export default BookStatusCard;
