import { defaultSiteContent } from '@/lib/site-content'
import ProjectDetailClient from './project-detail-client'
import './styles.css'

export function generateStaticParams() {
  return defaultSiteContent.projects.map((project) => ({
    id: project.id,
  }))
}

export default function ProjectDetail({ params }: { params: { id: string } }) {
  return <ProjectDetailClient id={params.id} />
}