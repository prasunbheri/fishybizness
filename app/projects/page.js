import { getProjects } from "@/lib/data"
import AnimatedSection from "@/components/AnimatedSection"
import ProjectCard from "@/components/ProjectCard"

export const revalidate = 0

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AnimatedSection>
        <span className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-medium">
          Portfolio
        </span>
        <h1 className="text-4xl font-bold mt-1 mb-2 text-zinc-800 dark:text-white">Our Projects</h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mb-12 text-sm">
          Every aquarium we build tells a story. Browse our collection of custom designs, from nano reefs to planted biotopes.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </div>
  )
}
