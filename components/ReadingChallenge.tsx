'use client';

import { useEffect, useState } from 'react';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const ReadingChallenge = ({ goal }: { goal?: number | null }) => {
  const [progress, setProgress] = useState(13);
  const [currentGoal, setCurrentGoal] = useState(goal || 1);
  const [inputValue, setInputValue] = useState(String(currentGoal));

  const updateBothValues = (newValue: number) => {
    setCurrentGoal(newValue);
    setInputValue(String(newValue));
  };

  const decrementGoal = () => {
    const newValue = Math.max(1, Number(inputValue) - 1);
    updateBothValues(newValue);
  };

  const incrementGoal = () => {
    const newValue = Math.min(999, Number(inputValue) + 1);
    updateBothValues(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setInputValue('');
      return;
    }
    if (!/^\d+$/.test(value)) {
      return;
    }
    setInputValue(value);
  };

  const handleInputBlur = () => {
    let numberValue = parseInt(inputValue || '1', 10);
    numberValue = Math.max(1, Math.min(999, numberValue));
    setCurrentGoal(numberValue);
    setInputValue(String(numberValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setProgress(50), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <h2 className="font-semibold text-[20px] my-2 ">
        {new Date().getFullYear()} Reading Challenge
      </h2>
      <div className="flex flex-col max-w-[420px] bg-white rounded-3xl mb-6 shadow-lg h-[190px] items-center justify-center">
        {goal ? (
          <>
            <h1 className="h1 text-brand-100">{progress}%</h1>
            <Progress value={progress} className="w-[60%] my-3" />
            <p className="font-regular text-[16px]">6 books completed</p>
          </>
        ) : (
          <>
            <p className="text-center mx-20 py-4 font-normal">
              You don&apos;t have a reading goal!
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-brand font-semibold p-6 text-[18px]">
                  Set Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[512px] bg-white flex flex-col items-center">
                <DialogHeader>
                  <DialogTitle className="text-center text-[24px] mb-2 font-bold">
                    Set Reading Goal
                  </DialogTitle>
                  <DialogDescription className="mb-2 text-[16px] text-center font-medium">
                    How many books are you going to read in{' '}
                    {new Date().getFullYear()}?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-between w-full max-w-[400px] px-4 my-3">
                  <Button
                    variant="ghost"
                    className="text-[64px] w-20 h-20 flex items-center justify-center"
                    onClick={decrementGoal}
                  >
                    -
                  </Button>
                  <div className="w-48 text-center">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      onKeyDown={handleKeyDown}
                      className="text-[78px] font-semibold text-brand-100 w-full text-center bg-transparent tabular-nums focus:outline-none"
                      inputMode="numeric"
                      pattern="\d*"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    className="text-[64px] w-20 h-20 flex items-center justify-center"
                    onClick={incrementGoal}
                  >
                    +
                  </Button>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-brand text-[16px] py-5 px-12 font-semibold"
                  >
                    Done
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </>
  );
};

export default ReadingChallenge;
