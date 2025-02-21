import { getBooks } from '@/lib/actions/book.actions';
import React from 'react';

const SearchBooks = async ({ params }: { params: { searchTerm: string } }) => {
  const decodedSearchTerm = decodeURIComponent(params.searchTerm);

  const books = (await getBooks({ searchTerm: decodedSearchTerm })).books;

  return (
    <div className="mb-12 mt-36 mx-12">
      <ul>
        {books.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBooks;
