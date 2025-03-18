import { User } from '@/types';
import Image from 'next/image';
import React from 'react';

const FriendCard = ({ friend }: { friend: User }) => {
  return (
    <div className="flex gap-3 w-full bg-white rounded-lg">
      <div className="relative w-[135px] h-[135px] flex-shrink-0">
        <Image
          src={friend.profilePic || '/icons/profile-pib.jpg'}
          alt={friend.name}
          fill
          className="rounded-lg object-cover"
        />
      </div>
      <div className="flex flex-col">
        <h1>{friend.name}</h1>
        <p>0 friends in common</p>
        <p>0 books read</p>
      </div>
    </div>
  );
};

export default FriendCard;
