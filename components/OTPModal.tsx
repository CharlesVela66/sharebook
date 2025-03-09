'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import Image from 'next/image';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { sendEmailOTP, verifySecret } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';

const OTPModal = ({
  email,
  accountId,
}: {
  email: string;
  accountId: string;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call API to verify OTP
      const sessionId = await verifySecret({ accountId, password });

      if (sessionId) router.push('/');
    } catch (error) {
      console.error('Failed to verify OTP', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    await sendEmailOTP({ email });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="font-bold text-[36px] text-center">
            Enter OTP
          </AlertDialogTitle>
          <Image
            src="/icons/close-dark.svg"
            alt="close"
            width={20}
            height={20}
            onClick={() => setIsOpen(false)}
            className="absolute -right-1 -top-7 cursor-pointer sm:-right-2 sm:-top-4"
          />
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            We&apos;ve sent a code to{' '}
            <span className="pl-1 text-brand">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className="w-full flex justify-center">
            <InputOTPSlot
              index={0}
              className="text-[36px] w-16 h-16 font-bold text-brand "
            />
            <InputOTPSlot
              index={1}
              className="text-[36px] w-16 h-16 font-bold text-brand"
            />
            <InputOTPSlot
              index={2}
              className="text-[36px] w-16 h-16 font-bold text-brand"
            />
            <InputOTPSlot
              index={3}
              className="text-[36px] w-16 h-16 font-bold text-brand"
            />
            <InputOTPSlot
              index={4}
              className="text-[36px] w-16 h-16 font-bold text-brand"
            />
            <InputOTPSlot
              index={5}
              className="text-[36px] w-16 h-16 font-bold text-brand"
            />
          </InputOTPGroup>
        </InputOTP>
        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-3">
            <div className="flex justify-center">
              <AlertDialogAction
                onClick={handleSubmit}
                className="w-fit p-6 bg-brand"
                type="button"
                disabled={isLoading}
              >
                Submit
                {isLoading && (
                  <Image
                    src="/icons/loader.svg"
                    alt="loader"
                    width={24}
                    height={24}
                    className="ml-2 animate-spin"
                  />
                )}
              </AlertDialogAction>
            </div>
            <div className="subtitle-2 mt-2 text-center text-light-100">
              Didn&apos;t get a code?
              <Button
                type="button"
                variant="link"
                className="pl-1 text-brand"
                onClick={handleResendOTP}
              >
                Click to resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OTPModal;
