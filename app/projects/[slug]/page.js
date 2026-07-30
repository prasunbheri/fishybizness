import { getProjects, getProject } from "@/lib/data"
import AnimatedSection from "@/components/AnimatedSection"
import ProjectDetailClient from "./ProjectDetailClient"

export const revalidate = 0

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: "Project Not Found" }
  return {
    title: `${project.title} | FishyBizness Aquatics`,
    description: project.description.slice(0, 160),
  }
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return (
      <div className="pt-24 pb-20 px-4 text-center">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <p className="text-zinc-500 mt-2">The project you are looking for does not exist.</p>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <AnimatedSection>
        <span className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-medium">
          {project.date}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold mt-1 mb-6 text-zinc-800 dark:text-white">
          {project.title}
        </h1>
      </AnimatedSection>

      <ProjectDetailClient project={project} />

      <AnimatedSection delay={0.3}>
        <div className="mt-10">
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
            {project.description}
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
