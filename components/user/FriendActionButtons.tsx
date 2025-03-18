'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { updateFriendRequestStatus } from '@/lib/actions/friend.request.actions';

interface FriendActionButtonsProps {
  requestId: string;
  onStatusChange?: (requestId: string, status: 'accepted' | 'declined') => void;
}

const FriendActionButtons = ({
  requestId,
  onStatusChange,
}: FriendActionButtonsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestResponse = async (status: 'accepted' | 'declined') => {
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

      // Notify parent component if callback is provided
      if (onStatusChange) {
        onStatusChange(requestId, status);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        className="bg-green text-white rounded p-2 h-8 w-8"
        onClick={() => handleRequestResponse('accepted')}
        disabled={isSubmitting}
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        className="bg-red-500 text-white rounded p-2 h-8 w-8"
        onClick={() => handleRequestResponse('declined')}
        disabled={isSubmitting}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FriendActionButtons;
