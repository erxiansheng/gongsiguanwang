"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, Sparkles, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSiteContent } from '@/hooks/use-site-content'

const valueIcons = [Star, Users, Sparkles, Heart]

export default function AboutPage() {
  const { content } = useSiteContent()
  const about = content.about

  return (
    <div className="pt-24">
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                {about.heroTitle}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {about.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="/contact">
                    {about.primaryButton}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/projects">
                    {about.secondaryButton}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
              <Image
                src={about.heroImage}
                alt={about.heroTitle}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">{about.storyTitle}</h2>
            <p className="text-muted-foreground text-lg">
              {about.storySubtitle}
            </p>
          </div>

          <div className="space-y-16">
            {about.milestones.map((milestone, index) => (
              <div key={`${milestone.year}-${milestone.title}`} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium mb-4">
                    {milestone.year}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{milestone.title}</h3>
                  <p className="text-muted-foreground mb-6">{milestone.description}</p>
                </div>
                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                  <div className="relative h-[300px] rounded-lg overflow-hidden">
                    <Image
                      src={milestone.image}
                      alt={milestone.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">{about.valuesTitle}</h2>
            <p className="text-muted-foreground text-lg">
              {about.valuesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {about.values.map((value, index) => {
              const Icon = valueIcons[index] || Star
              return (
                <div key={value.title} className="bg-card p-8 rounded-lg border border-border text-center">
                  <div className="text-primary inline-flex items-center justify-center mb-6">
                    <Icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">{about.teamTitle}</h2>
            <p className="text-muted-foreground text-lg">
              {about.teamSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {about.team.map((member) => (
              <div key={member.name} className="group">
                <div className="relative mb-6 overflow-hidden rounded-lg aspect-[3/4]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-primary text-sm mb-3">{member.title}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
                {about.ctaTitle}
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                {about.ctaSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contact">
                    {about.ctaPrimaryButton}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href="/contact">
                    {about.ctaSecondaryButton}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}