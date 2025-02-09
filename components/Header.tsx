import React from 'react';
import Search from './Search';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="flex justify-between">
      <Search />
      <div className="flex gap-3">
        <Image src="/icons/logout.svg" alt="logout" width={32} height={32} />
        <Image
          src="/images/profile-pic.jpg"
          alt="profile"
          width={48}
          height={48}
          className="rounded-full m-6 object-cover h-[48px]"
        />
      </div>
    </header>
  );
};

export default Header;
