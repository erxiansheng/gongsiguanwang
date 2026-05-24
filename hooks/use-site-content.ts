"use client"

import { useEffect, useState } from 'react'
import { defaultSiteContent, normalizeSiteContent, SiteContent } from '@/lib/site-content'
import { apiUrl } from '@/lib/api-config'

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadContent() {
      try {
        const response = await fetch(apiUrl('/content'), { cache: 'no-store' })
        if (!response.ok) throw new Error('内容接口暂时不可用')
        const data = await response.json()
        if (!cancelled && data?.content) {
          setContent(normalizeSiteContent(data.content))
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : '内容加载失败')
          setContent(normalizeSiteContent(defaultSiteContent))
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadContent()

    return () => {
      cancelled = true
    }
  }, [])

  return { content: content ?? defaultSiteContent, isLoading, error }
}