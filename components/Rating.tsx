'use client';

import { setUserBookActivity } from '@/lib/actions/book.actions';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';

const Rating = ({
  userId,
  bookId,
  userRating,
  starSize,
  edit = false,
  bookAvgRating = 0,
  className,
}: {
  userId?: string;
  bookId?: string;
  userRating?: number;
  starSize?: number;
  edit?: boolean;
  bookAvgRating?: number;
  className?: string;
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (edit && userRating !== undefined) {
      setRating(userRating);
    } else if (!edit && bookAvgRating !== undefined) {
      setRating(bookAvgRating);
    }
  }, [userRating, bookAvgRating, edit]);

  const handleRatingClick = async (selectedRating: number) => {
    // Only proceed if in edit mode
    if (!edit) return;

    try {
      setIsSubmitting(true);
      setMessage('');

      // Update local state immediately for responsive UI
      setRating(selectedRating);

      // Ensure we have the required IDs for the API call
      if (!userId || !bookId) {
        setMessage('Missing user or book information');
        return;
      }

      const response = await setUserBookActivity({
        userId,
        bookId,
        rating: selectedRating,
      });

      console.log('Rating update response:', response);

      if (response && response.success) {
        setTimeout(() => setMessage(''), 2000);
      } else {
        // If the server response indicates failure, revert to previous rating
        setRating(userRating || 0);
        setMessage('Failed to update rating');
      }
    } catch (error) {
      console.error('Error updating rating:', error);
      setRating(userRating || 0);
      setMessage('Error updating rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex">
        {[...Array(5)].map((_, index) => {
          const currentRating = index + 1;

          return (
            <label key={index} className={isSubmitting ? 'opacity-50' : ''}>
              <input
                type="radio"
                name="rating"
                value={currentRating}
                checked={currentRating === rating}
                onChange={() => {}}
                className="hidden"
                disabled={isSubmitting || !edit}
              />
              <span
                className={`${
                  edit && !isSubmitting ? 'cursor-pointer' : 'cursor-default'
                }`}
                style={{
                  fontSize: starSize ? `${starSize}px` : '48px',
                  color:
                    currentRating <= (hover || rating) ? '#FFCC00' : '#e4e5e9',
                }}
                onMouseEnter={() =>
                  edit && !isSubmitting && setHover(currentRating)
                }
                onMouseLeave={() => edit && !isSubmitting && setHover(0)}
                onClick={() =>
                  edit && !isSubmitting && handleRatingClick(currentRating)
                }
              >
                &#9733;
              </span>
            </label>
          );
        })}
      </div>
      {message && <p className="text-sm mt-1">{message}</p>}
    </div>
  );
};

export default Rating;
