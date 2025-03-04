import BookCard from '@/components/BookCard';
import { getBooksBySearchTerm } from '@/lib/actions/book.actions';
import { getCurrentUser } from '@/lib/actions/user.actions';
import React from 'react';

const SearchBooks = async ({
  params,
}: {
  params: Promise<{ searchTerm: string }>;
}) => {
  const param = await params;
  const decodedSearchTerm = decodeURIComponent(param.searchTerm);

  const user = await getCurrentUser();
  const books = (
    await getBooksBySearchTerm({
      searchTerm: decodedSearchTerm,
      userId: user.$id,
    })
  ).books;

  return (
    <div className="mb-12 mt-36 mx-12">
      {books ? (
        <ul>
          {books.map((book) => (
            <BookCard user={user} book={book} key={book.id} type="search" />
          ))}
        </ul>
      ) : (
        <p>No books found</p>
      )}
    </div>
  );
};

export default SearchBooks;
