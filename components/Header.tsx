import { User } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import Search from './Search';
import { signOutUser } from '@/lib/actions/user.actions';
import { getUserFriendRequest } from '@/lib/actions/friend.request.actions';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import FriendActionButtons from './user/FriendActionButtons';

const Header = async ({ user }: { user: User }) => {
  const requests = await getUserFriendRequest({
    userId: user.$id,
  });

  return (
    <header className="flex justify-between bg-white p-4 h-[104px] fixed top-0 z-50 left-[213px] right-0">
      <Search />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Image
            src="/icons/bell.svg"
            alt="Notification Bell"
            width={26}
            height={26}
            className="mx-8"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white w-[400px] flex flex-col space-y-2 p-4">
          {requests.friends.length > 0 ? (
            requests.friends.map((friend) => (
              <div key={friend.$id}>
                <DropdownMenuItem className="flex justify-between items-center w-full">
                  <Link href={`/profile/${friend.$id}`}>
                    <Image
                      src={friend.profilePic}
                      alt={friend.name}
                      width={50}
                      height={50}
                      className="rounded-full h-[50px] object-cover"
                    />
                  </Link>
                  <p className="text-[16px] font-normal">
                    <span className="text-brand font-semibold">
                      {friend.name}
                    </span>{' '}
                    has sent you a friend request
                  </p>
                  <FriendActionButtons requestId={friend.requestId} />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
            ))
          ) : (
            <p className="text-center py-2">You are up to date!</p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex gap-3 items-center">
        <Image
          src="/icons/logout.svg"
          alt="logout"
          width={28}
          height={28}
          onClick={signOutUser}
          className="cursor-pointer"
        />
        <Link href={`/profile/${user.$id}`}>
          <Image
            src={user.profilePic || '/images/profile-pic.png'}
            alt="profile"
            width={48}
            height={48}
            className="rounded-full mx-6 object-cover h-[48px] w-[48px]"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
