import Image from 'next/image';
import React from 'react';
import { users } from '../constants';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  return (
    <div className="max-w-[920px] bg-white rounded-3xl mb-8 shadow-lg h-[220px]">
      <Image
        src={users[0].profilePic}
        alt="profile"
        width={48}
        height={48}
        className="rounded-full object-cover h-[48px] absolute z-10 -translate-x-5 -translate-y-1"
      />
      <div className="flex flex-col my-2 ml-6">
        <h2 className="text-[18px] font-normal ml-3 mb-4">
          <span className="text-brand font-medium ">{users[0].name}</span> is
          currently reading
        </h2>
        <div className="flex flex-row gap-4">
          <Image
            src={book.coverImage}
            alt={book.name}
            width={90}
            height={130}
            className="rounded-lg object-cover"
          />
          <div className="flex flex-col mr-4">
            <h2 className="font-semibold text-[24px] mb-2">{book.name}</h2>
            <h4 className="font-medium italic text-[16px]">by {book.author}</h4>
          </div>
        </div>
        {/* Book shelf button */}
        <div className="flex justify-end items-end -translate-x-6 -translate-y-4">
          <Button className="bg-dark-300 text-white rounded-lg">
            Want to Read
            <Separator orientation="vertical" />
            <Image
              src="/icons/select-icon.svg"
              alt="select icon"
              width={12}
              height={12}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
