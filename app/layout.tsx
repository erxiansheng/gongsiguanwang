import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import SeoUpdater from '@/components/seo-updater';

export const metadata: Metadata = {
  title: '澄造数字 | 品牌与数字体验工作室',
  description: '以策略、设计与技术帮助品牌建立清晰、有温度、可持续增长的数字体验。',
  keywords: ['品牌设计', '网站建设', '用户体验设计', '数字化转型', '企业官网'],
  robots: 'index, follow',
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
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}