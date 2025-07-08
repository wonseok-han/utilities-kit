import type { Metadata } from 'next';

import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: `wonseok-han's Dev Tools`,
  description: `Essential developer utilities and productivity tools`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} mx-auto max-w-3xl px-6 lg:max-w-6xl lg:px-8 text-red-800`}
      >
        {children}
      </body>
    </html>
  );
}
