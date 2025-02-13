import React from 'react';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  return <div className="w-full bg-white rounded-md mb-8">{book.name}</div>;
};

export default BookCard;
