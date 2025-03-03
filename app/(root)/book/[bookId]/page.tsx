import BookStatusModal from '@/components/BookStatusModal';
import Rating from '@/components/Rating';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getUserBookActivity } from '@/lib/actions/book.actions';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { fixStatusTexts } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

const BookPage = async ({ params }: { params: { bookId: string } }) => {
  const param = await params;

  const user = await getCurrentUser();
  const result = await getUserBookActivity({
    userId: user.$id,
    bookId: param.bookId,
  });
  // Check if result exists and has at least one book
  if (!result || result.length === 0) {
    // Handle case where book isn't found
    return <div>Book not found</div>;
  }

  const book = result[0];
  const text = fixStatusTexts(book?.status)?.buttonText;

  return (
    <section className="mb-12 mt-36 ml-12 mr-24 flex gap-8">
      <div>
        <div className="relative w-[232px] h-[388px] flex-shrink-0 mb-8 shadow-xl rounded-xl">
          <Image
            src={book.thumbnail || '/images/book-open.svg'}
            alt={book.title}
            fill
            className="rounded-xl object-cover"
            sizes="310px"
          />
        </div>
        <BookStatusModal
          userId={user.$id}
          bookId={book.id}
          status={book.status}
          trigger={
            <BookStatusModal
              status={book.status}
              userId={user.$id}
              bookId={book.id}
              trigger={
                <Button className="w-full bg-white flex justify-center items-center gap-6 rounded-2xl p-5 shadow-lg">
                  <Image
                    src="/icons/edit.svg"
                    alt="edit"
                    width={20}
                    height={20}
                  />
                  <p className="text-[18px] font-medium">
                    {text || 'Want to Read'}
                  </p>
                </Button>
              }
            />
          }
        />
        <Rating
          userId={user.$id}
          bookId={book.id}
          userRating={book.userRating}
          starSize={48}
          edit
          className="items-center"
        />
        <p className="font-medium text-[18px] text-center underline">
          Rate this book
        </p>
      </div>
      <div className="flex flex-col w-full">
        <h1 className="text-[48px] font-bold">{book.title}</h1>
        <h3 className="text-[28px] font-normal">{book.authors?.join(', ')}</h3>
        <div className="flex gap-3 items-center ">
          <Rating bookAvgRating={book.averageRating} starSize={48} />
          <p className="font-medium text-[18px]">
            {book.averageRating.toFixed(1)} avg rating - {book.ratingsCount}{' '}
            ratings
          </p>
        </div>
        <div className="mt-2 mb-8">
          <p className="text-[18px] font-light text-justify">
            {book.description.substring(0, 600)}...
          </p>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="show-more">
              <AccordionTrigger className="text-[16px]">
                Show More
              </AccordionTrigger>
              <AccordionContent className="text-[18px] font-light text-justify">
                {book.description.substring(600)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <p className="text-[18px] font-light mb-6">
          Categories:{' '}
          <span className="font-medium">{book?.categories.join(', ')}</span>
        </p>
        <div className="font-light text-[16px] mb-6">
          <p>{book.pageCount} pages</p>
          <p>First published in: {book.publishedDate}</p>
        </div>
        <Separator className="bg-dark-300" />
        <div className="flex py-8 px-12 justify-between font-medium text-[14px]">
          <p>x people are currently reading</p>
          <p>y people want to read</p>
        </div>
        <Separator className="bg-dark-300" />
      </div>
    </section>
  );
};

export default BookPage;
