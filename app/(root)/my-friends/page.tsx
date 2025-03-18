import FriendModal from '@/components/user/FriendModal';
import { getUserFriends } from '@/lib/actions/friend.request.actions';
import { getCurrentUser } from '@/lib/actions/user.actions';
import React from 'react';

const MyFriends = async () => {
  const user = await getCurrentUser();

  const { friends } = await getUserFriends({ userId: user.$id });

  return (
    <section className="mb-12 mt-36 mx-12">
      <div className="flex justify-between">
        <p>Search</p>
        <FriendModal />
      </div>
      {friends.length > 0 ? (
        <>
          {friends.map((friend) => (
            // <FriendCard key={friend.$id} friend={friend} user={user} />
            <div key={friend.$id}>Hola</div>
          ))}
        </>
      ) : (
        <p>You don&apos;t have any friends!</p>
      )}
    </section>
  );
};

export default MyFriends;
