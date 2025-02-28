import EditProfile from '@/components/EditProfile';
import Feed from '@/components/Feed';
import ReadingChallenge from '@/components/ReadingChallenge';
import StatusCard from '@/components/StatusCard';
import { getUserBookActivity } from '@/lib/actions/book.actions';
import { getCurrentUser } from '@/lib/actions/user.actions';
import Image from 'next/image';
import React from 'react';

const Profile = async () => {
  const user = await getCurrentUser();
  const bookActivity = await getUserBookActivity({ userId: user.$id });
  const count = bookActivity?.filter((act) => act?.status === 'Read').length;

  return (
    <section className="flex flex-col mb-12 mt-36 mx-12">
      <div className="flex justify-between w-full mb-4">
        <div className="flex gap-6 relative w-full">
          <Image
            src={user.profilePic || '/images/profile-pic.jpg'}
            alt="profile picture"
            width={232}
            height={266}
            className="rounded-full h-[232px] object-cover"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold text-[28px]">{user.name}</h3>
            <p className="font-normal text-[18px] mb-[104px]">
              (joined in {user.$createdAt})
            </p>
            <p className="font-normal text-[18px]">
              Birthday: {user.dateOfBirth}
            </p>
            <p className="font-normal text-[18px]">
              {count} ratings (4.00 average)
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
        feed={bookActivity}
        user={user}
        className="w-full items-center justify-center"
      />
    </section>
  );
};

export default Profile;
