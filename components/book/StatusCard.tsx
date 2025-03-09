import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const StatusCard = ({
  status,
  imageSrc,
}: {
  status: string;
  imageSrc: string;
}) => {
  return (
    <Link
      href={`/my-books/${status.toLowerCase().replaceAll(' ', '-')}`}
      className="flex flex-col items-center justify-center bg-white rounded-2xl w-full max-w-[420px] py-8 shadow-lg"
    >
      <Image src={imageSrc} alt={status} width={90} height={90} />
      <p className="font-normal text-[18px] text-center">{status}</p>
    </Link>
  );
};

export default StatusCard;
