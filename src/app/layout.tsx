import './globals.css';
import { inter, playfair } from '@/lib/fonts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Providers } from './providers';

export const metadata = {
  title: 'Tiny Threads | Baby Dresses & More',
  description: 'Premium quality baby dresses for all occasions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
