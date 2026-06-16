import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import SeoUpdater from '@/components/seo-updater';
import VisitTracker from '@/components/visit-tracker';

export const metadata: Metadata = {
  title: '金科云创 | 专业车载测试培训',
  description: '更专业 · 更负责 · 好就业 · 好口碑 帮助每一个学员完成就业',
  keywords: ['车载测试', '车载测试培训', '新能源汽车测试', 'HIL测试', '智能驾驶测试'],
  robots: 'index, follow',
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <SeoUpdater />
            <VisitTracker />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
