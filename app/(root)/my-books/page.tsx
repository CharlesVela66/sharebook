import { getUserBooksByStatus } from '@/lib/actions/book.actions';
import { getCurrentUser } from '@/lib/actions/user.actions';
import React from 'react';

const MyBooks = async () => {
  const user = await getCurrentUser();
  const books = await getUserBooksByStatus({ userId: user.$id });

  return (
    <div className="mb-12 mt-36 mx-12">
      {books.total > 0 ? (
        <p>El usuario si ha tenido actividad</p>
      ) : (
        <p>El usuario no ha tenido actividad</p>
      )}
    </div>
  );
};

export default MyBooks;
