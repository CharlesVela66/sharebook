import EditProfile from '@/components/user/EditProfile';
import Feed from '@/components/user/Feed';
import ReadingChallenge from '@/components/book/ReadingChallenge';
import StatusCard from '@/components/book/StatusCard';
import { getUserActivity } from '@/lib/actions/book.actions';
import { formatDate, formatDateOptions } from '@/lib/utils';
import { Book } from '@/types';
import Image from 'next/image';
import React from 'react';
import { getUserById } from '@/lib/actions/user.actions';

const Profile = async ({ params }: { params: { userId: string } }) => {
  const param = await params;
  const user = await getUserById({ userId: param.userId });
  if (!user) {
    throw new Error('User not found');
  }
  const response = await getUserActivity({ userId: user.$id });
  const bookActivity = response.books;
  const count = bookActivity?.filter((act) => act?.userRating).length;
  const ratingAvg =
    bookActivity.length > 0
      ? (
          bookActivity?.reduce(
            (accum, act) =>
              act?.userRating ? act?.userRating + accum : accum + 0,
            0
          ) / count
        ).toFixed(2)
      : 0;

  const formattedFeed = [
    {
      userId: user.$id,
      userName: user.name,
      userProfilePic: user.profilePic || '/images/profile-pic.png',
      books: (bookActivity || []).filter((book): book is Book => book !== null),
    },
  ];

  return (
    <section className="flex flex-col mb-12 mt-36 mx-12">
      <div className="flex justify-between w-full mb-4">
        <div className="flex gap-6 relative w-full">
          <Image
            src={user.profilePic || '/images/profile-pic.png'}
            alt="profile picture"
            width={232}
            height={266}
            className="rounded-full h-[232px] object-cover"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold text-[28px]">{user.name}</h3>
            <p className="font-normal text-[18px] mb-[104px]">
              (joined in{' '}
              {formatDate({
                dateString: user.createdAt,
                option: formatDateOptions['MMM-YYYY'],
              })}
              )
            </p>
            <p className="font-normal text-[18px]">
              Birthday:{' '}
              {formatDate({
                dateString: user.dateOfBirth,
                option: formatDateOptions['MMMM-DD-YYYY'],
              })}
            </p>
            <p className="font-normal text-[18px]">
              {count} {count === 1 ? 'rating' : 'ratings'} ({ratingAvg} avg)
            </p>
          </div>
          <EditProfile user={user} />
        </div>
        <div className="max-w-[420px] w-full">
          <ReadingChallenge
            goal={user.readingGoal}
            userId={user.$id}
            readBookCount={count!}
          />
        </div>
      </div>
      <div className="flex w-full mb-12 justify-between gap-4">
        <StatusCard status="Read" imageSrc="/icons/check.svg" />
        <StatusCard
          status="Currently Reading"
          imageSrc="/icons/book-open.svg"
        />
        <StatusCard status="Want To Read" imageSrc="/icons/book-closed.svg" />
      </div>
      <Feed
        feed={formattedFeed}
        user={user}
        className="w-full items-center justify-center"
      />
    </section>
  );
};

export default Profile;
