'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '../ui/button';
import { setUserBookActivity } from '@/lib/actions/book.actions';

const BookStatusModal = ({
  status,
  userId,
  bookId,
  trigger,
}: {
  status: string;
  userId: string;
  bookId: string;
  trigger: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>(status);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!userId) {
        throw new Error('User ID is required');
      }

      const result = await setUserBookActivity({
        userId: userId,
        bookId: bookId,
        status: currentStatus,
      });

      if (result && result.success) {
        setIsOpen(false);
      } else throw new Error('Setting user book activity failed.');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[512px] bg-white flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="text-center text-[24px] mb-2 font-bold">
            Set Book Activity Status
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-between w-full max-w-[400px] px-4 my-3 gap-y-6">
          <Button
            className={`w-full text-[18px] py-8 rounded-2xl ${
              currentStatus === 'Read' ? 'bg-brand' : ''
            }`}
            variant={currentStatus === 'Read' ? 'default' : 'outline'}
            onClick={() => setCurrentStatus('Read')}
          >
            Read
          </Button>
          <Button
            className={`w-full text-[18px] py-8 rounded-2xl ${
              currentStatus === 'CurrentlyReading' ? 'bg-brand' : ''
            }`}
            variant={
              currentStatus === 'CurrentlyReading' ? 'default' : 'outline'
            }
            onClick={() => setCurrentStatus('CurrentlyReading')}
          >
            Currently Reading
          </Button>
          <Button
            className={`w-full text-[18px] py-8 rounded-2xl ${
              currentStatus === 'WantToRead' ? 'bg-brand' : ''
            }`}
            variant={currentStatus === 'WantToRead' ? 'default' : 'outline'}
            onClick={() => setCurrentStatus('WantToRead')}
          >
            Want To Read
          </Button>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-brand text-[16px] py-5 px-12 font-semibold"
            onClick={handleSubmit}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookStatusModal;
