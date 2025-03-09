'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { ChangeEvent, useRef, useState } from 'react';
import { User } from '@/types';
import InputField from '../InputField';
import { uploadProfilePicture } from '@/lib/actions/user.actions';

declare interface EditProfileProps {
  user: User;
}

const EditProfile = ({ user }: EditProfileProps) => {
  const { $id, name, profilePic, username, email, dateOfBirth, country } = user;

  const [currentUser, setCurrentUser] = useState({
    id: $id,
    name: name,
    profilePic: profilePic,
    username: username,
    email: email,
    dateOfBirth: dateOfBirth,
    country: country,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(profilePic);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCurrentUser((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);

      setCurrentUser((prev) => ({
        ...prev,
        profilePic: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const updatedUser = await uploadProfilePicture(currentUser);
      if (!updatedUser) {
        throw new Error('Could not upload image.');
      }
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute top-2 right-14">
      <Dialog open={open} onOpenChange={setOpen}>
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
          <div className="h-[200px]">
            <Image
              src={previewImage || '/images/profile-pic.png'}
              alt="user"
              width={200}
              height={200}
              className="rounded-full object-cover h-[200px]"
            />
            <Button
              className="bg-white relative shadow-xl rounded-full w-8 h-8 left-36 bottom-9"
              onClick={handleImageUpload}
            >
              <Image
                src="/icons/edit-circle.svg"
                alt="edit"
                fill
                className="object-contain p-1.5"
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          </div>
          <form
            className="flex flex-col w-full px-8 gap-y-3 items-center justify-center"
            onSubmit={handleSubmit}
          >
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
                  type="date"
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
                disabled={isLoading}
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
