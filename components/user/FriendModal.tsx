'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { User } from '@/types';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { useDebounce } from 'use-debounce';
import {
  getCurrentUser,
  getUsersBySearchTerm,
} from '@/lib/actions/user.actions';

const FriendModal = () => {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [debouncedQuery] = useDebounce(query, 300);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedQuery.length < 3) {
        setUsers([]);
        setError('');
        return;
      }
      try {
        setLoading(true);
        setError('');
        const user = await getCurrentUser();
        const response = await getUsersBySearchTerm({
          searchTerm: debouncedQuery,
          userId: user.$id,
        });

        if (!response.success) {
          throw new Error('Failed to fetch the users by search term');
        }

        setUsers(response.friends.filter((user) => user !== null));
      } catch (error) {
        setError('Failed to fetch users. Please try again.');
        console.error(error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [debouncedQuery]);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green text-white rounded-lg font-semibold p-5">
          + Add Friends
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[452px] max-h-[473px] h-full bg-white flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="text-center text-[24px] mb-2 font-bold">
            Add Friends
          </DialogTitle>
        </DialogHeader>
        <div className="relative w-full md:max-w-[730px]">
          <Image
            src="/icons/search.svg"
            alt="search"
            width={20}
            height={20}
            className="absolute left-4 top-6 -translate-y-1/2 z-10"
          />
          <Input
            type="text"
            placeholder="Search People..."
            className="h-[50px] rounded-2xl shadow-md font-light pl-12"
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none">
            {loading && (
              <Loader2 className="w-full h-full animate-spin text-gray-400" />
            )}
          </div>

          {error && (
            <p id="search-error" className="text-red-500 text-sm mt-2">
              {error}
            </p>
          )}
        </div>
        <ul className="flex flex-col my-1 space-y-3 w-full h-full">
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user.$id} className="flex justify-between">
                <div className="flex gap-2">
                  <Image
                    src={user.profilePic}
                    alt={user.name}
                    width={56}
                    height={56}
                    className="rounded-full object-cover h-[56px]"
                  />
                  <div>
                    <h2 className="font-medium text-[18px]">{user.name}</h2>
                    <p className="font-light text-[14px]">@{user.username}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button className="bg-green text-white rounded-lg">
                    + Add
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <p className="flex items-center justify-center h-full w-full pb-12 font-light text-dark-100">
              {debouncedQuery.length < 3
                ? "Type a user's name in the search bar!"
                : 'No users were found!'}
            </p>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default FriendModal;
