import BookCard from '@/components/BookCard';
import { getUserActivity } from '@/lib/actions/book.actions';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { transformStatusParams } from '@/lib/utils';
import { Book } from '@/types';
import React from 'react';

const MyBooksByStatus = async ({
  params,
}: {
  params: { bookStatus: string };
}) => {
  const param = await params;

  const user = await getCurrentUser();
  const userActivity = await getUserActivity({
    userId: user.$id,
    status: `${transformStatusParams(param.bookStatus)}`,
  });
  const books = userActivity.books;

  return (
    <div className="mb-12 mt-36 mx-12">
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
    </div>
  );
};

export default MyBooksByStatus;
