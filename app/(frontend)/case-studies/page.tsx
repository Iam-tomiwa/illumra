import { AnimatedElement } from "@/components/animated-element";
import PagesHero from "@/components/pages-hero";
import { ProjectsSection } from "@/components/home-widgets/projects-section";
import { sanityFetch } from "@/sanity/lib/fetch";
import { projectsQuery, caseStudiesPageQuery, ctaSectionQuery } from "@/sanity/lib/queries";
import { CTASection } from "@/components/home-widgets/cta-section";
import { HomePageQueryResult, ProjectsContent } from "@/sanity.types";
import { resolveBackgroundUrl } from "@/components/home-widgets/hero-section";

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
        <div className="container mx-auto px-4 py-12">
          <ProjectsSection projects={projectsList} />
        </div>
      )}

      <CTASection cta={homePage?.cta} />
    </div>
  );
}
