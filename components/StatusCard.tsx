import Image from 'next/image';
import React from 'react';

const StatusCard = ({
  status,
  imageSrc,
}: {
  status: string;
  imageSrc: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-2xl w-full max-w-[420px] py-8 shadow-lg">
      <Image src={imageSrc} alt={status} width={90} height={90} />
      <p className="font-normal text-[18px] text-center">{status}</p>
    </div>
  );
};

export default StatusCard;
