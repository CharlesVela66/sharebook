import React from 'react';
import Search from './Search';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '@/types';
import { signOutUser } from '@/lib/actions/user.actions';

const Header = ({ user }: { user: User }) => {
  return (
    <header className="flex justify-between bg-white p-4  h-[104px] fixed top-0 z-50 left-[213px] right-0">
      <Search />
      <Image
        src="/icons/bell.svg"
        alt="Notification Bell"
        width={26}
        height={26}
        className="mx-8"
      />
      <div className="flex gap-3 items-center">
        <Image
          src="/icons/logout.svg"
          alt="logout"
          width={28}
          height={28}
          onClick={signOutUser}
          className="cursor-pointer"
        />
        <Link href={`/profile/${user.$id}`}>
          <Image
            src={user.profilePic || '/images/profile-pic.jpg'}
            alt="profile"
            width={48}
            height={48}
            className="rounded-full mx-6 object-cover h-[48px] w-[48px]"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
