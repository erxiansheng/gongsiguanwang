"use client"

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ProjectCard from '@/components/projects/project-card'
import { useSiteContent } from '@/hooks/use-site-content'

export default function ProjectsPage() {
  const { content } = useSiteContent()
  const [activeCategory, setActiveCategory] = useState(content.projectsPage.allCategoryLabel)

  const categories = useMemo(
    () => [content.projectsPage.allCategoryLabel, ...Array.from(new Set(content.projects.map(project => project.category)))],
    [content.projects, content.projectsPage.allCategoryLabel]
  )

  const filteredProjects = activeCategory === content.projectsPage.allCategoryLabel
    ? content.projects
    : content.projects.filter(project => project.category === activeCategory)

  return (
    <div className="pt-24">
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
              {content.projectsPage.heroTitle}
            </h1>
            <p className="text-xl text-muted-foreground">
              {content.projectsPage.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-6">{content.projectsPage.featuredBadge}</Badge>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
                {content.projectsPage.featuredTitle}
              </h2>
              <p className="text-muted-foreground mb-6">
                {content.projectsPage.featuredDescription}
              </p>
              <ul className="space-y-3 mb-8">
                {content.projectsPage.featuredBullets.map((bullet) => (
                  <li key={bullet} className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <Button asChild>
                <Link href="/contact">
                  {content.projectsPage.featuredButton}
                </Link>
              </Button>
            </div>
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
              <Image
                src={content.projectsPage.featuredImage}
                alt={content.projectsPage.featuredTitle}
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
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">{content.projectsPage.processTitle}</h2>
            <p className="text-muted-foreground text-lg">
              {content.projectsPage.processSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.projectsPage.processSteps.map((step) => (
              <div key={step.number} className="relative p-8 bg-card rounded-lg border border-border">
                <div className="text-5xl font-playfair font-bold text-muted/20 absolute top-4 right-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-3 mt-6">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-6">
              {content.projectsPage.ctaTitle}
            </h2>
            <p className="text-primary-foreground/80 text-xl mb-8">
              {content.projectsPage.ctaSubtitle}
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                {content.projectsPage.ctaButton}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}