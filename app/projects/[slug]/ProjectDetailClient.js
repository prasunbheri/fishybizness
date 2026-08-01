'use client'

import ImageCarousel from '@/components/ImageCarousel'

export default function ProjectDetailClient({ project }) {
  return <ImageCarousel images={project.images} className="!aspect-[16/9]" />
}
