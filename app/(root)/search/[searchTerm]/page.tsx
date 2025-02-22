import BookCard from '@/components/BookCard';
import { getBooks } from '@/lib/actions/book.actions';
import React from 'react';

const SearchBooks = async ({
  params,
}: {
  params: Promise<{ searchTerm: string }>;
}) => {
  const resolvedParams = await params;
  const decodedSearchTerm = decodeURIComponent(resolvedParams.searchTerm);

  const books = (await getBooks({ searchTerm: decodedSearchTerm })).books;

  return (
    <div className="mb-12 mt-36 mx-12">
      {books ? (
        <ul>
          {books.map((book) => (
            <BookCard book={book} key={book.id} />
          ))}
        </ul>
      ) : (
        <p>No books found</p>
      )}
    </div>
  );
};

export default SearchBooks;
