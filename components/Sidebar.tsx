'use client';

import { navItems } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="p-4 sm:flex flex-col bg-white min-h-full remove-scrollbar sm:max-w-[100px] md:max-w-[200px] lg:max-w-[220px] fixed">
      <div className="flex items-center">
        <Image src="/images/logo-black.png" alt="logo" width={70} height={40} />
        <div className="flex justify-center">
          <Image
            src="/images/text-black.png"
            alt="logo-text"
            width={110}
            height={20}
            className="h-fit"
          />
        </div>
      </div>
      <nav>
        <ul className="flex flex-col my-12">
          {navItems.map((item) => (
            <Link key={item.id} href={item.path}>
              <li
                className={cn(
                  'flex py-3 my-5 mx-2 items-center sm:justify-normal justify-center gap-3 rounded-2xl',
                  pathname === item.path && 'bg-brand shadow-drop-2'
                )}
              >
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={32}
                  height={32}
                  className="md:mx-4 sm:ml-2"
                ></Image>
                <p className="font-medium lg:text-[18px] sm:[12px] sm:mr-1 hidden sm:block">
                  {item.name}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
