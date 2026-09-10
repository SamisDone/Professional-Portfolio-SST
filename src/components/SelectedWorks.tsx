import { motion } from "framer-motion";
import { featuredProjects } from "../data/content";
import ProjectVisual from "./ProjectVisual";

const SPANS = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];
const ASPECTS = ["aspect-[4/3]", "aspect-square", "aspect-square", "aspect-[4/3]"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function SelectedWorks() {
  return (
    <section id="work" className="bg-bg py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-14 gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">
                Selected Work
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display leading-[1.05] text-text-primary">
              Featured <span className="italic">projects</span>
            </h2>
            <p className="text-sm md:text-base text-muted max-w-md mt-4">
              A selection of projects I've worked on, from published Chrome
              extensions to full-stack platforms.
            </p>
          </div>

          <a
            href="#more-projects"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("more-projects")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative hidden md:inline-flex rounded-full shrink-0"
          >
            <span
              className="absolute -inset-[1.5px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundImage: "linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)" }}
            />
            <span className="relative z-10 inline-flex items-center gap-2 rounded-full border border-stroke bg-bg px-5 py-2.5 text-sm text-text-primary">
              View all work <span aria-hidden>↗</span>
            </span>
          </a>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {featuredProjects.map((project, i) => (
            <motion.a
              href={project.live ?? project.repo}
              target="_blank"
              rel="noopener noreferrer"
              key={project.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.05 }}
              className={`group relative overflow-hidden rounded-3xl bg-surface border border-stroke ${SPANS[i]} ${ASPECTS[i]}`}
            >
              <ProjectVisual
                art={project.art}
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(0deg, hsl(0 0% 4% / 0.85) 0%, hsl(0 0% 4% / 0.15) 45%, transparent 65%)",
                }}
              />

              <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
                <span className="text-xs text-muted uppercase tracking-[0.2em]">
                  {project.category}
                </span>
                <div>
                  <h3 className="font-display italic text-2xl md:text-3xl text-text-primary mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted max-w-xs">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] uppercase tracking-wide text-muted border border-stroke rounded-full px-2 py-1"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 backdrop-blur-lg transition-opacity duration-300 flex items-center justify-center">
                <span className="relative rounded-full p-[1.5px] animated-gradient-border">
                  <span className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm text-black">
                    View — <span className="font-display italic">{project.title}</span>
                  </span>
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
