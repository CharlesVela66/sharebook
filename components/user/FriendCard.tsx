import { User } from '@/types';
import Image from 'next/image';
import React from 'react';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';

const FriendCard = ({ friend }: { friend: User }) => {
  return (
    <Link
      href={`/profile/${friend.$id}`}
      className="flex w-full bg-white rounded-3xl pt-5 pb-3 px-2 shadow-lg justify gap-6"
    >
      <div className="relative w-[135px] h-[135px] flex-shrink-0">
        <Image
          src={friend.profilePic || '/icons/profile-pib.jpg'}
          alt={friend.name}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col space-y-2 w-full">
        <h1 className="text-[28px] font-semibold">{friend.name}</h1>
        <p className="text-[16px] font-light">0 friends in common</p>
        <p className="text-[14px] font-light italic">0 books read</p>
        <div className="mr-2">
          <Button className="flex gap-2 bg-green-100 text-white rounded-xl w-full">
            <Check />
            Friend
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default FriendCard;
