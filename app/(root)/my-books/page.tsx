import BookCard from '@/components/BookCard';
import { getUserActivity } from '@/lib/actions/book.actions';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { Book } from '@/types';
import React from 'react';

const MyBooks = async () => {
  const user = await getCurrentUser();
  const userActivity = await getUserActivity({ userId: user.$id });
  const books = userActivity.books;

  return (
    <section className="mb-12 mt-36 mx-12">
      {books.length > 0 ? (
        <>
          {books
            .filter((book): book is Book => book !== null)
            .map((book) => (
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
