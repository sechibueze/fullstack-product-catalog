import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { WebVitals } from '@/components/analytics/WebVitals';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME ?? 'Product Catalog',
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME ?? 'Product Catalog'}`,
  },
  description: 'Browse our curated product catalog with reviews and ratings.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ),
  openGraph: {
    type: 'website',
    siteName: process.env.NEXT_PUBLIC_APP_NAME ?? 'Product Catalog',
    description: 'Browse our curated product catalog with reviews and ratings.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.variable}>
        <WebVitals />
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              {children}
              <Toaster
                position='top-right'
                richColors
                closeButton
                toastOptions={{
                  style: {
                    fontFamily: 'var(--font-sans)',
                  },
                }}
              />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
