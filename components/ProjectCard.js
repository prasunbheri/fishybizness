'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-800 mb-3">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent z-10" />
          <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-zinc-500 text-sm">
            📷 {project.images.length} photo{project.images.length > 1 ? 's' : ''}
          </div>
          <motion.div
            className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
          />
          <div className="absolute bottom-3 left-3 right-3 z-30">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <h3 className="font-semibold text-zinc-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5">{project.date}</p>
      </Link>
    </motion.div>
  )
}
