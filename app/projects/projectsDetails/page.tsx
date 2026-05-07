import { Suspense } from 'react'
import ProjectDetailQueryClient from './project-detail-query-client'
import './[id]/styles.css'

export default function ProjectDetailsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 mt-20 min-h-screen" />}>
      <ProjectDetailQueryClient />
    </Suspense>
  )
}