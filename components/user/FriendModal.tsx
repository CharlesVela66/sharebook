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
import { Loader2, Check, X } from 'lucide-react';
import { Input } from '../ui/input';
import { useDebounce } from 'use-debounce';
import {
  getCurrentUser,
  getUsersBySearchTerm,
} from '@/lib/actions/user.actions';
import {
  sendFriendRequest,
  checkExistingRequest,
  updateFriendRequestStatus,
} from '@/lib/actions/friend.request.actions';

type FriendStatus = {
  exists: boolean;
  status?: string;
  senderId?: string;
  receiverId?: string;
  documentId?: string;
};

type UserWithStatus = User & {
  friendStatus?: FriendStatus;
};

const FriendModal = () => {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [users, setUsers] = useState<UserWithStatus[]>([]);
  const [debouncedQuery] = useDebounce(query, 300);
  const [error, setError] = useState('');

  useEffect(() => {
    const getUserId = async () => {
      const user = await getCurrentUser();
      setCurrentUserId(user.$id);
    };
    getUserId();
  }, []);

  const handleFriendRequest = async (receiverId: string) => {
    try {
      setIsSubmitting(true);
      const response = await sendFriendRequest({
        senderId: currentUserId,
        receiverId,
      });

      if (!response.success) {
        console.error('Failed to send friend request:', response.message);
        return;
      }

      // Update the local state to reflect the new request status
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.$id === receiverId) {
            return {
              ...user,
              friendStatus: {
                exists: true,
                status: 'pending',
                senderId: currentUserId,
                receiverId,
                documentId: response.data?.$id,
              },
            };
          }
          return user;
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestResponse = async (
    requestId: string,
    status: 'accepted' | 'declined'
  ) => {
    try {
      setIsSubmitting(true);
      const response = await updateFriendRequestStatus({
        requestId,
        status,
      });

      if (!response.success) {
        console.error(`Could not ${status} the request:`, response.message);
        return;
      }

      // Update the local state to reflect the new status
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.friendStatus?.documentId === requestId) {
            return {
              ...user,
              friendStatus: {
                ...user.friendStatus,
                status,
              },
            };
          }
          return user;
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

        const usersWithoutNull = response.friends.filter(
          (user): user is User => user !== null
        );

        // Check friendship status for each user
        const usersWithStatus = await Promise.all(
          usersWithoutNull.map(async (user) => {
            const friendStatus = await checkExistingRequest({
              userId1: currentUserId,
              userId2: user.$id,
            });

            return {
              ...user,
              friendStatus,
            };
          })
        );

        setUsers(usersWithStatus);
      } catch (error) {
        setError('Failed to fetch users. Please try again.');
        console.error(error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchUsers();
    }
  }, [debouncedQuery, currentUserId]);

  const renderActionButton = (user: UserWithStatus) => {
    const status = user.friendStatus;

    // No relationship exists
    if (!status || !status.exists) {
      return (
        <Button
          className="bg-green text-white rounded-lg"
          onClick={() => handleFriendRequest(user.$id)}
          disabled={isSubmitting}
        >
          + Add
        </Button>
      );
    }

    // Friend request already accepted
    if (status.status === 'accepted') {
      return (
        <Button className="bg-green-100 text-white rounded-lg" disabled>
          Friends
        </Button>
      );
    }

    // Current user sent the pending request
    if (status.status === 'pending' && status.senderId === currentUserId) {
      return (
        <Button className="bg-green/80 text-white rounded-lg" disabled>
          Pending
        </Button>
      );
    }

    // Current user received a pending request
    if (status.status === 'pending' && status.receiverId === currentUserId) {
      return (
        <div className="flex gap-2">
          <Button
            className="bg-green text-white rounded p-2 h-8 w-8"
            onClick={() =>
              handleRequestResponse(status.documentId!, 'accepted')
            }
            disabled={isSubmitting}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            className="bg-red-500 text-white rounded p-2 h-8 w-8"
            onClick={() =>
              handleRequestResponse(status.documentId!, 'declined')
            }
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    // Fallback
    return (
      <Button
        className="bg-green text-white rounded-lg"
        onClick={() => handleFriendRequest(user.$id)}
        disabled={isSubmitting}
      >
        + Add
      </Button>
    );
  };

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
        <ul className="flex flex-col my-1 space-y-3 w-full h-full overflow-y-auto">
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
                  {renderActionButton(user)}
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
