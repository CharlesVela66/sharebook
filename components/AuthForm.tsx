'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { authFormSchema } from '@/lib/utils';
import { FormType } from '@/types';
import { createAccount, signInUser } from '@/lib/actions/user.actions';
import Image from 'next/image';
import Link from 'next/link';
import OTPModal from './OTPModal';

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [accountId, setAccountId] = useState(null);

  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      username: '',
      dateOfBirth: '',
      country: '',
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const user =
        type === 'sign-up'
          ? await createAccount({
              name: values.name || '',
              email: values.email,
              username: values.username || '',
              country: values.country || '',
              dateOfBirth: values.dateOfBirth || '',
            })
          : await signInUser({ email: values.email });

      setAccountId(user.accountId);
    } catch {
      setErrorMessage('Failed to create an account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full max-w-[754px] items-center justify-center"
        >
          <h1 className="font-bold text-[48px]">
            {type === 'sign-in' ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="font-light text-[16px] mb-5">
            {type === 'sign-in'
              ? 'Enter your email below to login to your account'
              : 'Enter your information below to create an account'}
          </p>
          {type === 'sign-up' && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full px-12 mb-2">
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        className="shad-input"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full px-12 mb-2">
                <div>
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          {type === 'sign-up' && (
            <>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-full px-12 mb-2">
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your username"
                          {...field}
                          className="shad-input"
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="w-full px-12 mb-2">
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">
                        Date Of Birth
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your date of birth"
                          {...field}
                          className="shad-input"
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="w-full px-12 mb-2">
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">Country</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your country"
                          {...field}
                          className="shad-input"
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />
            </>
          )}
          <Button
            type="submit"
            className="bg-brand text-[18px] my-4 py-6 px-10"
            disabled={isLoading}
          >
            {type === 'sign-in' ? 'Login' : 'Create Account'}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>

          {errorMessage && <p className="error-message">*{errorMessage}</p>}
          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === 'sign-in'
                ? "Don't have an account?"
                : 'Already have an account?'}
            </p>
            <Link
              href={type === 'sign-in' ? 'sign-up' : 'sign-in'}
              className="ml-1 font-medium text-brand"
            >
              {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
            </Link>
          </div>
        </form>
      </Form>
      <div className="flex bg-brand h-screen w-full items-center justify-center">
        <Image
          src="/images/full-logo-black.png"
          alt="logo"
          width={600}
          height={600}
        />
      </div>

      {accountId && (
        <OTPModal email={form.getValues('email')} accountId={accountId} />
      )}
    </div>
  );
};

export default AuthForm;
