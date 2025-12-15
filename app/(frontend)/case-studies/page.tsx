import { AnimatedElement } from "@/components/animated-element";
import PagesHero from "@/components/pages-hero";
import { ProjectsSection } from "@/components/home-widgets/projects-section";
import { sanityFetch } from "@/sanity/lib/fetch";
import { projectsQuery, caseStudiesPageQuery, ctaSectionQuery } from "@/sanity/lib/queries";
import { CTASection } from "@/components/home-widgets/cta-section";
import { HomePageQueryResult, MediaAsset, ProjectsContent } from "@/sanity.types";
import { resolveBackgroundUrl } from "@/components/home-widgets/hero-section";
import Link from "next/link";
import { resolveMediaAsset } from "@/sanity/lib/utils";
import Image from "next/image";

export default async function CaseStudiesPage() {
  const [caseStudiesPage, projects, homePage] = await Promise.all([
    sanityFetch({ query: caseStudiesPageQuery }),
    sanityFetch({ query: projectsQuery }),
    sanityFetch({ query: ctaSectionQuery }),
  ]) as [
      Awaited<ReturnType<typeof sanityFetch<typeof caseStudiesPageQuery>>>,
      ProjectsContent[] | null,
      HomePageQueryResult,
    ];

  // Resolve background image
  const backgroundImage = resolveBackgroundUrl(
    caseStudiesPage?.backgroundImage as Parameters<typeof resolveBackgroundUrl>[0]
  )?.url;

  const projectsList = (Array.isArray(projects) ? projects : []) as ProjectsContent[];

  return (
    <div className="bg-white">
      <PagesHero backgroundImageUrl={backgroundImage}>
        <div className="max-w-3xl">
          <AnimatedElement delay={0.1}>
            <h1 className="page-title">{caseStudiesPage?.pageTitle || "Case Studies"}</h1>
            {caseStudiesPage?.description && (
              <p className="text-white mt-4">{caseStudiesPage.description}</p>
            )}
          </AnimatedElement>
        </div>
      </PagesHero>

      {projectsList.length > 0 && (
        <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-4">
          {projectsList.map(project => {
            const picture = project?.picture as MediaAsset | null | undefined;
            const imageResolved = picture
              ? resolveMediaAsset({
                ...picture,
                _type: "mediaAsset",
              } as MediaAsset)
              : undefined;
            return (
              <Link
                href={project.url ?? ""}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative hover:underline cursor-pointer text-white flex flex-col justify-end min-h-[420px] rounded-2xl shadow-lg p-4`}
              >
                <Image
                  src={imageResolved?.url ?? ""}
                  alt={imageResolved?.alt ?? ""}
                  fill
                  className={`object-cover`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />
                <div className="relative z-10 text-white">
                  <p className="text-xs uppercase text-yellow-400">
                    {project.projectCategory}
                  </p>
                  <h3 className="text-2xl font-semibold">{project.title}</h3>
                </div>
              </Link>
            );
          })}


        </div>
      )}

      <CTASection cta={homePage?.cta} />
    </div>
  );
}
