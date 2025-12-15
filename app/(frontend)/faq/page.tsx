import { AnimatedElement } from "@/components/animated-element";
import PagesHero from "@/components/pages-hero";
import FaqSection from "@/components/home-widgets/faq";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ctaSectionQuery, FAQ_QUERY } from "@/sanity/lib/queries";
import { CTASection } from "@/components/home-widgets/cta-section";
import { HomePageQueryResult } from "@/sanity.types";

export default async function DistributorsPage() {
  const faq = await sanityFetch({
    query: FAQ_QUERY,
  });
  const homePage = await sanityFetch({
    query: ctaSectionQuery,
  }) as HomePageQueryResult;
  return (
    <div className="bg-white">
      <PagesHero>
        <div className="max-w-3xl">
          <AnimatedElement delay={0.1}>
            <h1 className="page-title">Frequently Asked Questions</h1>
            <p className="text-white">
              {faq?.description}
            </p>
          </AnimatedElement>
        </div>
      </PagesHero>

      <FaqSection showHeading={false} faq={faq} />
      <CTASection cta={homePage?.cta} />
      <div className="mx-auto px-4 py-12">
      </div>
    </div>
  );
}
