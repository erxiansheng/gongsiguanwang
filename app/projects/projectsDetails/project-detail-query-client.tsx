"use client"

import { useSearchParams } from 'next/navigation'
import ProjectDetailClient from './[id]/project-detail-client'

export default function ProjectDetailQueryClient() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id') || ''

  return <ProjectDetailClient id={id} />
}