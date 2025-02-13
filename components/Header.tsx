import React from 'react';
import Search from './Search';
import Image from 'next/image';
import { users } from '../constants';

const Header = () => {
  return (
    <header className="flex justify-between bg-white p-4 w-full h-[104px]">
      <Search />
      <Image
        src="/icons/bell.svg"
        alt="Notification Bell"
        width={26}
        height={26}
        className="mx-8"
      />
      <div className="flex gap-3">
        <Image src="/icons/logout.svg" alt="logout" width={28} height={28} />
        <Image
          src={users[0].profilePic}
          alt="profile"
          width={48}
          height={48}
          className="rounded-full mx-6 mt-3 object-cover h-[48px]"
        />
      </div>
    </header>
  );
};

export default Header;
