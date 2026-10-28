import { Project } from "@/constants/projectData";
import Image from "next/image";

/* Frosted chips/buttons sit on the photo, so they use white-on-dark in both themes. */
const frosted = "border border-white/20 bg-white/10 backdrop-blur-md text-white";
const button = "inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium transition-all duration-300";

/** Full-bleed project tile: ~80% of the viewport height, info laid directly over the image. */
export function ProjectCard({ project }: { project: Project }) {
  const { title, description, image, stack, github, live } = project;

  return (
    <li className="h-[80dvh] w-[88vw] shrink-0 snap-start md:w-[70vw] lg:w-[min(64vw,calc(80dvh*1.45))]">
      <article className="group relative isolate h-full overflow-hidden rounded-3xl border border-white/15 bg-linear-to-br from-primary/40 to-accent/40 text-white sm:rounded-4xl">
        <Image
          src={image}
          alt={`${title} screenshot`}
          fill
          sizes="(min-width: 1024px) 64vw, 88vw"
          className="-z-10 object-cover transition-transform duration-900 ease-out group-hover:scale-105"
        />

        {/* Glass fade: blur + dark scrim that melt into the photo (no box edges) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black/75 via-black/35 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_top,#000_35%,transparent)] mask-[linear-gradient(to_top,#000_35%,transparent)]"
        />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 sm:p-8 lg:p-10">
          <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">{title}</h3>
          <p className="line-clamp-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">{description}</p>

          <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
              {stack.map((tech) => (
                <li key={tech} className={`${frosted} rounded-full px-3 py-1 text-xs`}>
                  {tech}
                </li>
              ))}
            </ul>

            <div className="flex gap-3">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} source code on GitHub`}
                className={`${frosted} ${button} hover:bg-white/25`}
              >
                GitHub
              </a>
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} live preview`}
                className={`${button} bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground`}
              >
                Live preview <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}