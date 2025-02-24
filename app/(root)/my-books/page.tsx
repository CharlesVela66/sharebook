import BookCard from '@/components/BookCard';
import { getUserBooksByStatus } from '@/lib/actions/book.actions';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { transformBookResponse } from '@/lib/utils';
import { Book } from '@/types';
import React from 'react';

const MyBooks = async () => {
  const user = await getCurrentUser();
  const books = await getUserBooksByStatus({ userId: user.$id });
  const transformedBooks = transformBookResponse(books);

  return (
    <section className="mb-12 mt-36 mx-12">
      {transformedBooks.length > 0 ? (
        <>
          {transformedBooks.map((book: Book) => (
            <BookCard key={book.id} book={book} user={user} type="search" />
          ))}
        </>
      ) : (
        <p>El usuario no ha tenido actividad</p>
      )}
    </section>
  );
};

export default MyBooks;
