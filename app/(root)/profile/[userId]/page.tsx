import EditProfile from '@/components/EditProfile';
import Feed from '@/components/Feed';
import ReadingChallenge from '@/components/ReadingChallenge';
import { users, usersBooks } from '@/constants';
import Image from 'next/image';
import React from 'react';

const Profile = () => {
  const user = users[0];
  const count = usersBooks.filter(
    (userBook) => userBook.idUser === user.id
  ).length;
  return (
    <section className="flex flex-col mb-12 mt-36 mx-12">
      <div className="flex justify-between w-full mb-6">
        <div className="flex gap-6 relative w-full">
          <Image
            src={user.profilePic}
            alt="profile picture"
            width={266}
            height={266}
            className="rounded-full h-[266px] object-cover"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold text-[28px]">{user.name}</h3>
            <p className="font-normal text-[18px] mb-32">
              (joined in {user.createdAt})
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
          <ReadingChallenge goal={user.readingGoal} />
        </div>
      </div>
      <div className="flex w-full mb-12 justify-between gap-4">
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl px-44 py-8 shadow-lg">
          <Image src="/icons/check.svg" alt="check" width={114} height={114} />
          <p className="font-normal text-[18px] text-center">Read</p>
        </div>
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl px-44 py-8 shadow-lg">
          <Image src="/icons/book-open.svg" alt="book" width={90} height={90} />
          <p className="font-normal text-[18px] text-center">
            Currently Reading
          </p>
        </div>
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl px-44 py-8 shadow-lg">
          <Image
            src="/icons/book-closed.svg"
            alt="book closed"
            width={96}
            height={96}
          />
          <p className="font-normal text-[18px] text-center">Want To Read</p>
        </div>
      </div>
      <Feed className="items-center justify-center" />
    </section>
  );
};

export default Profile;
