import { FormType } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: unknown) =>
  JSON.parse(JSON.stringify(value));

export const authFormSchema = (formType: FormType) => {
  return z.object({
    name:
      formType === 'sign-up'
        ? z.string().min(2).max(50)
        : z.string().optional(),
    username:
      formType === 'sign-up'
        ? z.string().min(2).max(50)
        : z.string().optional(),
    country:
      formType === 'sign-up'
        ? z.string().min(2).max(100)
        : z.string().optional(),
    dateOfBirth:
      formType === 'sign-up'
        ? z.string().min(2).max(100)
        : z.string().optional(),
    email: z.string().email(),
  });
};
