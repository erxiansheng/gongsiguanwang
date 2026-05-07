"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CircleDollarSign, Compass, Handshake, Lightbulb, MessageCircle, Network } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSiteContent } from '@/hooks/use-site-content'

const benefitIcons = [Compass, Lightbulb, Handshake, CircleDollarSign, MessageCircle, Network]

export default function PartnersPage() {
  const { content, isLoading } = useSiteContent()
  const page = content.partnersPage

  return (
    <div className={`pt-24 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
              {page.heroTitle}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {page.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.partners.map((partner, index) => (
              <div key={`${partner.name}-${index}`} className="overflow-hidden bg-card rounded-lg border border-border hover:border-primary/50 transition-all duration-300">
                <div className="relative h-64 overflow-hidden md:h-72">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={index < 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold">{partner.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
                {page.approachTitle}
              </h2>
              <p className="text-muted-foreground mb-8">
                {page.approachDescription}
              </p>

              <div className="space-y-6">
                {page.approachItems.map((item, index) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src={page.approachImage}
                alt={page.approachTitle}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">{page.benefitsTitle}</h2>
            <p className="text-muted-foreground text-lg">
              {page.benefitsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {page.benefits.map((benefit, index) => {
              const Icon = benefitIcons[index] || Compass
              return (
                <div key={benefit.title} className="p-8 bg-card rounded-lg border border-border">
                  <div className="text-primary mb-6"><Icon className="h-10 w-10" /></div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
                {page.ctaTitle}
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                {page.ctaSubtitle}
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">
                  {page.ctaButton}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src={page.ctaImage}
                alt={page.ctaTitle}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}