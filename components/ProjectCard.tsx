import { Project } from "@/constants/projectData";
import { glass, glassHover } from "@/constants/styles";
import Image from "next/image";


const pill = `${glass} rounded-full px-4 py-1.5 text-xs text-foreground/80`;
const button = "inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-medium transition-all duration-300";

/** Open layout, no card background: image takes 2/3, project info the remaining 1/3 (stacked on mobile). */
export function ProjectCard({ project }: { project: Project }) {
  const { title, description, image, stack, github, live } = project;

  return (
    <li className="w-[88vw] shrink-0 snap-start md:w-[calc(100vw-3rem)] lg:h-[60dvh] lg:w-[min(72rem,calc(100vw-3rem))]">
      <article className="group grid h-full gap-8 lg:grid-cols-[2fr_1fr] lg:gap-14">
        <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-border bg-linear-to-br from-primary/30 to-accent/30 lg:aspect-auto lg:h-full">
          <Image
            src={image}
            alt={`${title} screenshot`}
            fill
            sizes="(min-width: 1024px) 48rem, 88vw"
            className="object-cover transition-transform duration-900 ease-out group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col gap-10 lg:justify-between lg:py-2">
          <div className="flex flex-col gap-5">
            <h3 className="text-3xl font-semibold tracking-tight lg:text-4xl">{title}</h3>
            <p className="line-clamp-4 leading-relaxed text-foreground/70">{description}</p>
          </div>

          <div className="flex flex-col gap-8">
            <ul className="flex flex-wrap gap-2.5" aria-label="Tech stack">
              {stack.map((tech) => (
                <li key={tech} className={pill}>
                  {tech}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} source code on GitHub`}
                className={`${glass} ${glassHover} ${button}`}
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