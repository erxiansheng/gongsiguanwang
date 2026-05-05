"use client"

import { useEffect } from 'react'
import { useSiteContent } from '@/hooks/use-site-content'

export default function SeoUpdater() {
  const { content } = useSiteContent()
  const site = content.site

  useEffect(() => {
    document.title = site.title || site.brandName
    updateMeta('description', site.description)
    updateMeta('keywords', site.seoKeywords)
    updateMeta('robots', site.seoRobots)
    updateFavicon(site.faviconUrl)
  }, [site])

  return null
}

function updateMeta(name: string, content?: string) {
  if (!content) return
  let element = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.name = name
    document.head.appendChild(element)
  }
  element.content = content
}

function updateFavicon(href?: string) {
  if (!href) return
  let element = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!element) {
    element = document.createElement('link')
    element.rel = 'icon'
    document.head.appendChild(element)
  }
  element.href = href
}