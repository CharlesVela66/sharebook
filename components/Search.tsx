import Image from 'next/image';
import React from 'react';
import { Input } from './ui/input';

const Search = () => {
  return (
    <div className="relative w-full md:max-w-[730px] mt-3 pl-8">
      <div className="relative h-[52px] ">
        <Image
          src="/icons/search.svg"
          alt="search"
          width={20}
          height={20}
          className="absolute left-4 top-6 -translate-y-1/2 z-10"
        />
        <Input
          type="text"
          placeholder="Search Books..."
          className="h-[50px] rounded-2xl shadow-md font-light pl-12"
        />
      </div>
    </div>
  );
};

export default Search;
