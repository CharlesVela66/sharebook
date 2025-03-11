import FriendModal from '@/components/user/FriendModal';
import { getCurrentUser, getUserFriends } from '@/lib/actions/user.actions';
import { User } from '@/types';
import React from 'react';

const MyFriends = async () => {
  const user = await getCurrentUser();
  const response = await getUserFriends({ userId: user.$id });
  const friends = response.friends;
  return (
    <section className="mb-12 mt-36 mx-12">
      <div className="flex justify-between">
        <p>Search</p>
        <FriendModal />
      </div>
      {friends.length > 0 ? (
        <>
          {friends
            .filter((friend): friend is User => friend !== null)
            .map((friend) => (
              // <FriendCard key={friend.$id} friend={friend} user={user} />
              <div key={1}>Hola</div>
            ))}
        </>
      ) : (
        <p>You don&apos;t have any friends!</p>
      )}
    </section>
  );
};

export default MyFriends;
