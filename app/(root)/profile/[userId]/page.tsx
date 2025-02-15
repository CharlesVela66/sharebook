import ReadingChallenge from '@/components/ReadingChallenge';
import { users } from '@/constants';
import React from 'react';

const Profile = () => {
  const user = users[0];
  return (
    <section className="flex flex-col mb-12 mt-36 ml-12">
      <div className="flex">
        <div>Personal Information</div>
        <div>
          <ReadingChallenge />
        </div>
      </div>
      <div>Status Cards</div>
      <div>Feed</div>
    </section>
  );
};

export default Profile;
