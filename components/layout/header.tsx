"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { useSiteContent } from '@/hooks/use-site-content'

const LOGO_TEXT_TO_REPLACE = '金科云创'

function BrandMark({ brandName }: { brandName: string }) {
  const suffix = brandName.startsWith(LOGO_TEXT_TO_REPLACE)
    ? brandName.slice(LOGO_TEXT_TO_REPLACE.length)
    : brandName

  return (
    <span className="flex min-w-0 items-center gap-1.5 sm:gap-2">
      <Image
        src="/images/logo2.png"
        alt={LOGO_TEXT_TO_REPLACE}
        width={1200}
        height={452}
        priority
        className="h-6 w-auto flex-shrink-0 object-contain sm:h-7 md:h-8"
      />
      {suffix && (
        <span className="truncate font-playfair text-xl font-bold leading-none tracking-tight sm:text-2xl">
          {suffix}
        </span>
      )}
    </span>
  )
}

export default function Header() {
  const { content, isLoading } = useSiteContent()
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300',
          isScrolled
            ? 'bg-background/80 backdrop-blur-sm py-4 shadow-sm border-b border-border'
            : 'bg-transparent py-6',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex min-w-0 items-center">
              <BrandMark brandName={content.site.brandName} />
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {content.navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary relative py-2',
                    pathname === item.href
                      ? 'text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:content-[""]'
                      : 'text-foreground/70 hover:text-foreground'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full"
                aria-label="切换主题"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              <Button className="hidden md:flex" asChild>
                <Link href="/contact">联系我们</Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="打开导航菜单"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[110] min-h-dvh overflow-y-auto bg-background text-foreground shadow-2xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex min-w-0 items-center" onClick={() => setMobileMenuOpen(false)}>
                <BrandMark brandName={content.site.brandName} />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="关闭导航菜单"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-8">
              {content.navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-lg font-medium transition-colors hover:text-primary relative py-2',
                    pathname === item.href
                      ? 'text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:content-[""]'
                      : 'text-foreground/70 hover:text-foreground'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button className="w-full mt-4" asChild>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>联系我们</Link>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
