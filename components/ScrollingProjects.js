'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRef, useState } from 'react'

function ProjectThumb({ src, title }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (!src || error) {
    const initials = title
      .split(' ')
      .filter(w => w.length > 2)
      .slice(0, 2)
      .map(w => w[0])
      .join('')

    return (
      <div className="w-full h-full bg-gradient-to-br from-cyan-600 to-blue-800 flex items-center justify-center">
        <span className="text-3xl font-bold text-white/60">{initials}</span>
      </div>
    )
  }

  return (
    <div
      className={`w-full h-full bg-cover bg-center transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundImage: `url(${src})` }}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
    />
  )
}

function ProjectCard({ project }) {
  const img = project.images?.[0]

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block w-[320px] sm:w-[380px] shrink-0"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-800 mb-3">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/70 via-zinc-900/20 to-transparent z-10" />
        <ProjectThumb src={img} title={project.title} />
        <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
        <div className="absolute bottom-3 left-3 right-3 z-30">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-zinc-200 backdrop-blur-sm border border-white/10">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <h3 className="font-semibold text-zinc-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
        {project.title}
      </h3>
      <p className="text-xs text-zinc-500 mt-0.5">{project.date}</p>
    </Link>
  )
}

export default function ScrollingProjects({ projects }) {
  const trackRef = useRef(null)

  if (!projects.length) return null

  const duplicated = [...projects, ...projects]

  return (
    <div className="relative overflow-hidden">
      <motion.div
        ref={trackRef}
        className="flex gap-6 w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          x: {
            duration: 60,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      >
        {duplicated.map((project, i) => (
          <ProjectCard key={`${project.id}-${i}`} project={project} />
        ))}
      </motion.div>

      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-zinc-900 dark:via-zinc-900/80 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-zinc-900 dark:via-zinc-900/80 pointer-events-none" />
    </div>
  )
}
