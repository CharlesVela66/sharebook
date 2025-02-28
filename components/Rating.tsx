'use client';

import { setUserBookActivity } from '@/lib/actions/book.actions';
import React, { useState, useEffect } from 'react';

const Rating = ({
  userId,
  bookId,
  userRating,
}: {
  userId: string;
  bookId: string;
  userRating?: number;
}) => {
  const [rating, setRating] = useState<number>(userRating || 0);
  const [hover, setHover] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  // Update local state if prop changes
  useEffect(() => {
    if (userRating !== undefined) {
      setRating(userRating);
    }
  }, [userRating]);

  const handleRatingClick = async (selectedRating: number) => {
    try {
      setIsSubmitting(true);
      setMessage('');

      // Update local state immediately for responsive UI
      setRating(selectedRating);

      const response = await setUserBookActivity({
        userId,
        bookId,
        rating: selectedRating,
        type: 'update',
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
    <div className="flex flex-col items-center">
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
                disabled={isSubmitting}
              />
              <span
                className={`cursor-pointer text-[48px] ${
                  isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                style={{
                  color:
                    currentRating <= (hover || rating) ? '#FFCC00' : '#e4e5e9',
                }}
                onMouseEnter={() => !isSubmitting && setHover(currentRating)}
                onMouseLeave={() => !isSubmitting && setHover(0)}
                onClick={() =>
                  !isSubmitting && handleRatingClick(currentRating)
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
