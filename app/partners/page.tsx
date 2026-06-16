"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { WheelEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CircleDollarSign, Compass, Handshake, Lightbulb, MessageCircle, Network } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useSiteContent } from '@/hooks/use-site-content'
import type { Partner } from '@/lib/site-content'

const benefitIcons = [Compass, Lightbulb, Handshake, CircleDollarSign, MessageCircle, Network]

interface CategoryGroup {
  category: string
  order: number
  partners: Partner[]
}

interface LightboxImage {
  src: string
  alt: string
}

function groupPartnersByCategory(partners: Partner[]): CategoryGroup[] {
  const map = new Map<string, CategoryGroup>()

  for (const partner of partners) {
    const category = partner.category || '未分类'
    const order = typeof partner.categoryOrder === 'number' ? partner.categoryOrder : 0

    if (!map.has(category)) {
      map.set(category, { category, order, partners: [] })
    }
    map.get(category)!.partners.push(partner)
  }

  return Array.from(map.values()).sort((a, b) => a.order - b.order)
}

function ScrollingRow({ partners, onOpenImage }: { partners: Partner[]; onOpenImage: (image: LightboxImage) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const animationRef = useRef<number>(0)
  const scrollPositionRef = useRef(0)
  const needsScroll = partners.length > 4

  // For scrolling, duplicate items to create seamless loop
  const displayPartners = useMemo(() => {
    if (!needsScroll) return partners
    // Triple the items to ensure smooth infinite scroll
    return [...partners, ...partners, ...partners]
  }, [partners, needsScroll])

  const animate = useCallback(() => {
    if (!scrollRef.current || isPaused || !needsScroll) return

    scrollPositionRef.current += 0.5
    const singleSetWidth = scrollRef.current.scrollWidth / 3

    if (scrollPositionRef.current >= singleSetWidth) {
      scrollPositionRef.current -= singleSetWidth
    }

    scrollRef.current.scrollLeft = scrollPositionRef.current
    animationRef.current = requestAnimationFrame(animate)
  }, [isPaused, needsScroll])

  useEffect(() => {
    if (!needsScroll) return

    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [animate, needsScroll])

  useEffect(() => {
    scrollPositionRef.current = 0
    if (scrollRef.current) scrollRef.current.scrollLeft = 0
  }, [partners])

  const handleMouseEnter = () => {
    setIsPaused(true)
    cancelAnimationFrame(animationRef.current)
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  if (!needsScroll) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {partners.map((partner, index) => (
          <PartnerCard key={`${partner.name}-${index}`} partner={partner} index={index} onOpenImage={onOpenImage} />
        ))}
      </div>
    )
  }

  return (
    <div
      ref={scrollRef}
      className="flex gap-6 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ scrollBehavior: 'auto' }}
    >
      {displayPartners.map((partner, index) => (
        <div
          key={`${partner.name}-${index}`}
          className="w-[72vw] max-w-[280px] flex-shrink-0 sm:w-[42vw] sm:max-w-none md:w-[30vw] lg:w-[calc((100%-4.5rem)/4)]"
        >
          <PartnerCard partner={partner} index={index} onOpenImage={onOpenImage} />
        </div>
      ))}
    </div>
  )
}

function PartnerCard({ partner, index, onOpenImage }: { partner: Partner; index: number; onOpenImage: (image: LightboxImage) => void }) {
  return (
    <button
      type="button"
      className="group w-full overflow-hidden rounded-lg border border-border bg-card text-left transition-all duration-300 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={() => onOpenImage({ src: partner.logo, alt: partner.name })}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={partner.logo}
          alt={partner.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={index < 4}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold">{partner.name}</h3>
      </div>
    </button>
  )
}

function ImageLightbox({ image, onClose }: { image: LightboxImage | null; onClose: () => void }) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    setScale(1)
  }, [image?.src])

  function updateScale(delta: number) {
    setScale((current) => Math.min(4, Math.max(1, Number((current + delta).toFixed(2)))))
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault()
    updateScale(event.deltaY < 0 ? 0.2 : -0.2)
  }

  function handleImageClick() {
    setScale((current) => (current >= 2 ? 1 : Math.min(4, current + 0.8)))
  }

  return (
    <Dialog open={Boolean(image)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[94vw] border-white/10 bg-black p-0 text-white sm:max-w-[90vw]">
        <DialogTitle className="sr-only">{image?.alt || '图片预览'}</DialogTitle>
        {image && (
          <div className="flex h-[82vh] flex-col">
            <div
              className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4 sm:p-6"
              onWheel={handleWheel}
              onDoubleClick={() => setScale(1)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="max-h-full max-w-full select-none object-contain transition-transform duration-150"
                style={{ transform: `scale(${scale})`, cursor: scale > 1 ? 'zoom-out' : 'zoom-in' }}
                onClick={handleImageClick}
                draggable={false}
              />
            </div>
            <div className="border-t border-white/10 px-4 py-3 text-sm font-medium text-white/90">{image.alt}</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function PartnersPage() {
  const { content, isLoading } = useSiteContent()
  const page = content.partnersPage
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null)

  const categoryGroups = useMemo(
    () => groupPartnersByCategory(content.partners),
    [content.partners]
  )

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
          <div className="space-y-12">
            {categoryGroups.map((group) => (
              <div key={group.category}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold whitespace-nowrap">{group.category}</h2>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <ScrollingRow partners={group.partners} onOpenImage={setLightboxImage} />
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
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  )
}
