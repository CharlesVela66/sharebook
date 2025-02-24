import BookCard from '@/components/BookCard';
import { getUserBooksByStatus } from '@/lib/actions/book.actions';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { transformBookResponse, transformStatusParams } from '@/lib/utils';
import { Book } from '@/types';
import React from 'react';

const MyBooksByStatus = async ({
  params,
}: {
  params: { bookStatus: string };
}) => {
  const user = await getCurrentUser();
  const books = await getUserBooksByStatus({
    userId: user.$id,
    bookStatus: `${transformStatusParams(params.bookStatus)}`,
  });
  const transformedBooks = transformBookResponse(books);

  return (
    <div className="mb-12 mt-36 mx-12">
      {transformedBooks.length > 0 ? (
        <>
          {transformedBooks.map((book: Book) => (
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
