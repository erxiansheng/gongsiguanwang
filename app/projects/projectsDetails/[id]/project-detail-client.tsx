"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useSiteContent } from '@/hooks/use-site-content'
import { defaultSiteContent } from '@/lib/site-content'

export default function ProjectDetailClient({ id }: { id: string }) {
  const { content, isLoading } = useSiteContent()
  const project = content.projects.find((item) => item.id === id)
  const fallbackImage = content.projectsPage.featuredImage || defaultSiteContent.projects[0].image
  const [imageSrc, setImageSrc] = useState(fallbackImage)

  useEffect(() => {
    setImageSrc(project?.image?.trim() || fallbackImage)
  }, [project?.image, fallbackImage])

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 mt-20 min-h-screen" />
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{content.projectDetails.backLabel}</span>
          </Link>
          <h1 className="text-3xl font-bold mb-3">{content.projectDetails.missingTitle}</h1>
          <p className="text-muted-foreground">{content.projectDetails.missingDescription}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20 transition-opacity duration-300">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors mb-24"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{content.projectDetails.backLabel}</span>
        </Link>

        <div className="mb-8">
          <div className="relative w-full aspect-[21/9] mb-6 rounded-lg overflow-hidden">
            <Image
              src={imageSrc}
              alt={project.title}
              fill
              className="object-cover"
              onError={() => setImageSrc(fallbackImage)}
              priority
            />
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary" className="text-sm">
              {project.category}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-muted rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="prose prose-lg max-w-none text-foreground space-y-6">
          <p>{project.detailIntro || project.description}</p>
          {project.detailSections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
          {project.detailConclusion && <p>{project.detailConclusion}</p>}
        </div>
      </div>
    </div>
  )
}