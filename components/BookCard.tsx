import Image from 'next/image';
import React from 'react';
import { Book, User } from '@/types';
import { getUserBookActivity } from '@/lib/actions/book.actions';
import BookStatusModal from './BookStatusModal';
import { fixStatusTexts } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  user: User;
  type: 'feed' | 'search';
}

const BookCard = async ({ book, user, type }: BookCardProps) => {
  const bookActivity = await getUserBookActivity({
    userId: user?.$id,
    bookId: book.id,
  });

  const status = bookActivity?.[0]?.status;

  const text = fixStatusTexts(status);

  return (
    <div className="max-w-[920px] bg-white rounded-3xl mb-8 shadow-lg h-[220px]">
      {type === 'feed' && (
        <Image
          src={user.profilePic || '/images/profile-pic.jpg'}
          alt="profile"
          width={48}
          height={48}
          className="rounded-full object-cover h-[48px] absolute z-10 -translate-x-5 -translate-y-1"
        />
      )}
      <div className="flex flex-col my-2 ml-6">
        {type === 'feed' && (
          <h2 className="text-[18px] font-normal ml-3 mb-4">
            <span className="text-brand font-medium ">{user.name}</span>{' '}
            {text?.activityText}
          </h2>
        )}
        <div
          className={`flex flex-row gap-4 ${type === 'search' ? 'mt-6' : ''}`}
        >
          <div className="relative w-[100px] h-[155px] flex-shrink-0">
            <Image
              src={book.thumbnail || '/icons/book-open.svg'}
              alt={book.title || 'book'}
              fill
              className="rounded-lg object-cover"
              sizes="90px"
            />
          </div>
          <div className="flex flex-col mr-4">
            <h2 className="font-semibold text-[24px] mb-1">
              {book.title.length > 115
                ? `${book.title.substring(0, 116)}...`
                : `${book.title}`}
            </h2>
            <h4 className="font-medium italic text-[16px">by {book.authors}</h4>
            <p className="font-light text-[14px] line-clamp-2 overflow-hidden mt-2">
              {book.description}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-end">
          {type === 'search' && (
            <p className="w-full mt-2 text-[16px] italic font-light">
              {book.averageRating} avg rating - {book.ratingsCount} ratings
            </p>
          )}
          <div
            className={`flex justify-end w-full mr-6 ${
              type === 'search' ? '-translate-y-2' : '-translate-y-8'
            }`}
          >
            <BookStatusModal
              status={status}
              userId={user.$id}
              bookId={book.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
