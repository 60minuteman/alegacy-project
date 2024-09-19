import { Fraunces, DM_Sans } from 'next/font/google';

export const fraunces = Fraunces({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-fraunces',
});

export const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

// Keep your dmSans configuration if you have it
