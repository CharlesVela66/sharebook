import BookCard from '@/components/book/BookCard';
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
              <BookCard
                key={book.id}
                book={book}
                user={user}
                currentUser={user}
                type="search"
              />
            ))}
        </>
      ) : (
        <p>You don&apos;t have any activity!</p>
      )}
    </section>
  );
};

export default MyBooks;
