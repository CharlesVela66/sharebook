import BookStatusModal from '@/components/BookStatusModal';
import Rating from '@/components/Rating';
import { Button } from '@/components/ui/button';
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
  const book = result[0]!;
  const text = fixStatusTexts(book.status)?.buttonText;

  return (
    <section className="mb-12 mt-36 mx-12 flex gap-8">
      <div>
        <div className="relative w-[232px] h-[388px] flex-shrink-0">
          <Image
            src={book.thumbnail || '/images/book-open.svg'}
            alt={book.title}
            fill
            className="rounded-lg object-cover"
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
                <Button className="w-full bg-white flex justify-start items-center gap-6">
                  <Image
                    src="/icons/edit.svg"
                    alt="edit"
                    width={20}
                    height={20}
                  />
                  <p className="text-[18px] font-medium">{text}</p>
                </Button>
              }
            />
          }
        />
      </div>
      <div className="flex flex-col">
        <h1 className="text-[48px] font-bold">{book.title}</h1>
        <h3 className="text-[28px] font-normal">{book.authors}</h3>
        <div className="flex gap-3">
          <Rating
            userId={user.$id}
            bookId={book.id}
            userRating={book.userRating}
          />
        </div>
        <p className="text-[18px] font-light text-justify">
          {book.description}
        </p>
      </div>
    </section>
  );
};

export default BookPage;
