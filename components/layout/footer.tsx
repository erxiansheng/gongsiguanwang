"use client"

import Link from 'next/link'
import SocialQrButton from '@/components/social-qr-button'
import { useSiteContent } from '@/hooks/use-site-content'

export default function Footer() {
  const { content, isLoading } = useSiteContent()
  const serviceLinks = content.home.services.map((service) => service.title)
  const contact = content.contact.info

  return (
    <footer className={`bg-muted/30 py-16 mt-24 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-playfair font-bold">{content.site.brandName}</h3>
            <p className="text-muted-foreground max-w-xs">
              {content.site.footerText}
            </p>
            <div className="flex space-x-4 pt-2">
              {contact.socialLinks.map((link, index) => (
                <SocialQrButton
                  key={`${link.name}-${index}`}
                  link={link}
                  className="border-0 bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground"
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">导航</h4>
            <ul className="space-y-3">
              {content.navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">服务</h4>
            <ul className="space-y-3">
              {serviceLinks.map((item) => (
                <li key={item}>
                  <Link href="/#services-section" className="text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">联系</h4>
            <address className="not-italic text-muted-foreground space-y-3">
              {contact.addressLines.map((line) => <p key={line}>{line}</p>)}
              <p className="pt-2">
                <a href={`mailto:${contact.email}`} className="hover:text-foreground transition-colors">
                  {contact.email}
                </a>
              </p>
              <p>
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-foreground transition-colors">
                  {contact.phone}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left text-sm text-muted-foreground space-y-1">
            <p>© {new Date().getFullYear()} {content.site.brandName}。{content.site.copyright}</p>
            {content.site.icp && <p>{content.site.icp}</p>}
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {content.site.privacyLabel}
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {content.site.termsLabel}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}