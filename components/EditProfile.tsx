'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { ChangeEvent, useState } from 'react';
import { User } from '@/types';
import InputField from './InputField';

declare interface EditProfileProps {
  user: User;
}

const EditProfile = ({ user }: EditProfileProps) => {
  const { name, profilePic, username, email, dateOfBirth, country } = user;

  const [currentUser, setCurrentUser] = useState({
    name: name,
    profilePic: profilePic,
    username: username,
    email: email,
    dateOfBirth: dateOfBirth,
    country: country,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCurrentUser((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="absolute top-2 right-14">
      <Dialog>
        <DialogTrigger asChild>
          <Image
            src="/icons/edit.svg"
            alt="edit"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </DialogTrigger>
        <DialogContent className="max-w-[512px] bg-white flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-center text-[24px] mb-2 font-bold">
              Edit Personal Information
            </DialogTitle>
          </DialogHeader>
          <div>
            <Image
              src={profilePic || '/images/profile-pic.jpg'}
              alt="user"
              width={200}
              height={200}
              className="rounded-full h-[200px] object-cover"
            />
          </div>
          <form className="flex flex-col w-full px-8 gap-y-3 items-center justify-center">
            <div className="w-full">
              <InputField
                type="text"
                id="name"
                placeholder="Name"
                label="Name"
                value={currentUser.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <InputField
                  type="text"
                  id="username"
                  placeholder="Username"
                  label="Username"
                  value={currentUser.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-1/2">
                <InputField
                  type="email"
                  id="email"
                  placeholder="Email"
                  label="Email"
                  value={currentUser.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <InputField
                  type="text"
                  id="dateOfBirth"
                  placeholder="Date of Birth"
                  label="Date of Birth"
                  value={currentUser.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-1/2">
                <InputField
                  type="text"
                  id="country"
                  placeholder="Country"
                  label="Country"
                  value={currentUser.country}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter className="flex items-center justify-center mt-4">
              <Button
                type="submit"
                className="bg-brand text-[16px] py-5 px-12 font-semibold"
                onSubmit={() => {}}
              >
                Done
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfile;
