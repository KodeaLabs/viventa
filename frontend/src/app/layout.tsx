import { Inter, Playfair_Display } from 'next/font/google';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
