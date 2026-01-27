import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'AI Live Talk - Luyện nói tiếng Trung HSK của Bông',
  description: 'Ứng dụng luyện nói tiếng Trung với AI theo chuẩn HSK 1-6. Hội thoại real-time với AI tutor.',
  keywords: ['HSK', 'tiếng Trung', 'học tiếng Trung', 'AI tutor', 'luyện nói'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
