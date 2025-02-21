/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ReadingChallenge from '@/components/ReadingChallenge';
import BookStatusCard from '@/components/BookStatusCard';
import Feed from '@/components/Feed';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { getUserBooksByStatus } from '@/lib/actions/book.actions';
import { Book } from '@/types';

const Home = async () => {
  const user = await getCurrentUser();

  const [currentlyReadingBooks, readBooks, wantToReadBooks] = await Promise.all(
    [
      getUserBooksByStatus({
        userId: user.$id,
        bookStatus: 'CurrentlyReading',
      }),
      getUserBooksByStatus({
        userId: user.$id,
        bookStatus: 'Read',
      }),
      getUserBooksByStatus({
        userId: user.$id,
        bookStatus: 'WantToRead',
      }),
    ]
  );

  const transformDocumentListToBooks = (documentList: any): Book[] => {
    return documentList.documents.map((doc: any) => ({
      $id: doc.$id,
      name: doc.name,
      author: doc.author,
      description: doc.description,
      rating: doc.rating,
      numberRatings: doc.numberRatings,
      pageCount: doc.pageCount,
      publishedDate: doc.publishedDate,
      categories: doc.categories,
      coverImage: doc.coverImage,
    }));
  };

  return (
    <section className="flex mb-12 mt-36 ml-24">
      <Feed user={user} />
      <div className="flex flex-col h-full sticky max-w-[340px] w-full mx-6">
        <ReadingChallenge userId={user.$id} goal={user.readingGoal} />
        <BookStatusCard
          title="Currently Reading"
          books={transformDocumentListToBooks(currentlyReadingBooks)}
        />
        <BookStatusCard
          title="Want To Read"
          books={transformDocumentListToBooks(wantToReadBooks)}
        />
        <BookStatusCard
          title="Read"
          books={transformDocumentListToBooks(readBooks)}
        />
      </div>
    </section>
  );
};

export default Home;
