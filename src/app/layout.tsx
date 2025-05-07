
import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Using Inter as specified in globals.css
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TrackFit Go',
  description: 'Track your runs, achieve your goals.',
  icons: {
    icon: '/favicon.ico', // Placeholder, not generating actual favicon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <main className="flex-1 bg-background">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
