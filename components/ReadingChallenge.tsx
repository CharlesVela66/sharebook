'use client';

import { useEffect, useState } from 'react';
import { Progress } from './ui/progress';

const ReadingChallenge = () => {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(50), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <h2 className="font-semibold text-[20px] my-2 ">
        {new Date().getFullYear()} Reading Challenge
      </h2>
      <div className="flex flex-col max-w-[420px] bg-white rounded-3xl mb-8 shadow-lg h-[220px] items-center justify-center">
        <h1 className="h1 text-brand-100">{progress}%</h1>
        <Progress value={progress} className="w-[60%] my-3" />
        <p className="font-regular text-[16px]">6 books completed</p>
      </div>
    </>
  );
};

export default ReadingChallenge;
