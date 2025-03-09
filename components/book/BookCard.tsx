import Image from 'next/image';
import React from 'react';
import { Book, UserCardProps } from '@/types';
import BookStatusModal from './BookStatusModal';
import { fixStatusTexts, getTimeAgo } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import Rating from '../Rating';

interface BookCardProps {
  book: Book;
  user: UserCardProps;
  type: 'feed' | 'search';
}

const BookCard = async ({ book, user, type }: BookCardProps) => {
  const status = book?.status;

  const text = fixStatusTexts(status!);
  return (
    <div className="max-w-[920px] bg-white rounded-3xl mb-8 shadow-lg h-[220px]">
      {type === 'feed' && (
        <Image
          src={user.profilePic || '/images/profile-pic.png'}
          alt="profile"
          width={48}
          height={48}
          className="rounded-full object-cover h-[48px] absolute z-10 -translate-x-5 -translate-y-1"
        />
      )}
      <div className="flex flex-col my-2 ml-6">
        {type === 'feed' && (
          <div className="flex justify-between">
            <div className="flex gap-2">
              <h2 className="text-[18px] font-normal ml-3 mb-4">
                <span className="text-brand font-medium ">{user.name}</span>{' '}
                {book.userRating ? `rated a book` : text?.activityText}
              </h2>
              {book.userRating! > 0 && (
                <Rating
                  bookAvgRating={book.userRating}
                  starSize={24}
                  className="relative -top-1"
                />
              )}
            </div>
            <p className="mx-4 font-light">
              {getTimeAgo(book.$updatedAt!.toString())}
            </p>
          </div>
        )}
        <Link
          href={`/book/${book.id}`}
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
        </Link>
        <div className="flex justify-between items-end">
          {type === 'search' && (
            <p className="w-full mt-2 text-[16px] italic font-light">
              {book.averageRating.toFixed(1)} avg rating - {book.ratingsCount}{' '}
              {book.ratingsCount === 1 ? 'rating' : 'ratings'}
            </p>
          )}
          <div
            className={`flex justify-end w-full mr-6 ${
              type === 'search' ? '-translate-y-2' : '-translate-y-8'
            }`}
          >
            <BookStatusModal
              status={status!}
              userId={user.$id}
              bookId={book.id}
              trigger={
                <Button
                  className={`${
                    !status
                      ? 'text-black bg-white border-[2px] border-dark-300'
                      : status === 'WantToRead'
                      ? 'text-white bg-dark-300'
                      : status === 'CurrentlyReading'
                      ? 'text-white bg-brand-100'
                      : 'text-white bg-green'
                  } rounded-lg flex items-center gap-2 w-[150px]`}
                >
                  {status ? text?.buttonText : 'Want To Read'}
                  <Separator orientation="vertical" className="bg-current" />
                  <Image
                    src={
                      status
                        ? '/icons/select-icon.svg'
                        : '/icons/select-icon-black.svg'
                    }
                    alt="select icon"
                    width={12}
                    height={12}
                  />
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
