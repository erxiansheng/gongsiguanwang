"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, BarChart, Code, PenTool, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProjectCard from '@/components/projects/project-card'
import TestimonialSlider from '@/components/testimonial-slider'
import ScrollButton from '@/components/scroll-button'
import { useSiteContent } from '@/hooks/use-site-content'

const serviceIcons = [PenTool, Code, Users, BarChart]

export default function Home() {
  const { content, isLoading } = useSiteContent()

  return (
    <div className={`flex flex-col w-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/20 dark:from-background/95 dark:via-background/80 dark:to-background/95 z-10" />
          <Image
            src={content.home.hero.image}
            alt={content.home.hero.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="container relative z-20 px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              {content.home.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-xl">
              {content.home.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base" asChild>
                <Link href="/projects">
                  {content.home.hero.primaryButton}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base bg-white border border-blue-400 hover:bg-blue-50" asChild>
                <Link href="/contact">
                  {content.home.hero.secondaryButton}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-0 right-0 flex justify-center">
          <ScrollButton />
        </div>
      </section>

      <section id="services-section" className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
            <div className="max-w-2xl mb-8 md:mb-0">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">{content.home.servicesTitle}</h2>
              <p className="text-muted-foreground">
                {content.home.servicesSubtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.home.services.map((service, index) => {
              const Icon = serviceIcons[index] || PenTool
              return (
                <div key={`${service.title}-${index}`} className="group p-8 bg-card rounded-lg border border-border hover:border-primary/50 transition-all duration-300">
                  <div className="text-primary mb-6"><Icon className="h-10 w-10" /></div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
            <div className="max-w-md mb-8 md:mb-0">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">{content.home.featuredTitle}</h2>
              <p className="text-muted-foreground">
                {content.home.featuredSubtitle}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/projects">
                {content.home.featuredButton}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-center mb-16">
            {content.home.testimonialsTitle}
          </h2>

          <TestimonialSlider testimonials={content.home.testimonials} />
        </div>
      </section>

      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-6">
              {content.home.ctaTitle}
            </h2>
            <p className="text-primary-foreground/80 text-xl mb-8 max-w-xl mx-auto">
              {content.home.ctaSubtitle}
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                {content.home.ctaButton}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}