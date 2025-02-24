import { getUserBookActivity } from '@/lib/actions/book.actions';
import { getCurrentUser } from '@/lib/actions/user.actions';
import React from 'react';

const BookPage = async ({ params }: { params: { bookId: string } }) => {
  const param = await params;

  const user = await getCurrentUser();
  const result = await getUserBookActivity({
    userId: user.$id,
    bookId: param.bookId,
  });
  const book = result[0]!;

  return <section className="mb-12 mt-36 mx-12">{book.title}</section>;
};

export default BookPage;
