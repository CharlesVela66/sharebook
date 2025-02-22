import { getUserBooksByStatus } from '@/lib/actions/book.actions';
import { getCurrentUser } from '@/lib/actions/user.actions';
import React from 'react';

const MyBooksByStatus = async ({
  params,
}: {
  params: { bookStatus: string };
}) => {
  const user = await getCurrentUser();
  const books = await getUserBooksByStatus({
    userId: user.$id,
    bookStatus: params.bookStatus,
  });
  return <div>MyBooksByStatus</div>;
};

export default MyBooksByStatus;
