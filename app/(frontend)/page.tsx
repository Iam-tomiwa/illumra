import { HeroSection } from "@/components/home-widgets/hero-section";
import EnergyFeatures from "@/components/home-widgets/control-solutions-section";
import { AboutSection } from "@/components/home-widgets/about-section";
import { ProjectsSection } from "@/components/home-widgets/projects-section";
import { FeaturedProductsSection } from "@/components/home-widgets/featured-products-section";
// import { WhyChooseSection } from "@/components/home-widgets/why-choose-section";
import { TestimonialsSection } from "@/components/home-widgets/testimonials-section";
import { CTASection } from "@/components/home-widgets/cta-section";
import TrustedBy from "@/components/home-widgets/trusted-by-section";
import FaqSection from "@/components/home-widgets/faq";
import type { HomePageQueryResult, ProjectsContent } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
	categoryQuery,
	featuredProductsQuery,
	homePageQuery,
	FAQ_QUERY,
} from "@/sanity/lib/queries";
import { sanitizeSanityStrings } from "@/sanity/lib/utils";

export default async function WirelessControlSolutionsLandingPage() {
	const homePage = (await sanityFetch({
		query: homePageQuery,
	})) as HomePageQueryResult;
	const hero = homePage?.hero ?? undefined;
	const controlSolutions = homePage?.controlSolutions ?? undefined;
	const trustedBy = homePage?.trustedBy ?? undefined;
	const about = homePage?.about ?? undefined;
	const cta = homePage?.cta ?? undefined;
	const testimonials = homePage?.testimonials ?? [];
	const projects = homePage?.projects ?? [];
	const featuredProducts = await sanityFetch({
		query: featuredProductsQuery,
	});
	const categories = await sanityFetch({
		query: categoryQuery,
	});
	const faq = await sanityFetch({
		query: FAQ_QUERY,
	});

	const featuredProductsVisible = sanitizeSanityStrings(homePage?.featuredProductsVisible) !== "hide";
	const faqVisible = sanitizeSanityStrings(faq?.visible) !== "hide";
	const testimonialsVisible = sanitizeSanityStrings(homePage?.testimonialsVisible) !== "hide";
	const projectsVisible = sanitizeSanityStrings(homePage?.projectsVisible) !== "hide";
	const ctaVisible = sanitizeSanityStrings(cta?.visible) !== "hide";


	return (
		<div className="min-h-screen bg-background text-foreground">
			<HeroSection hero={hero} />
			{featuredProductsVisible && featuredProducts && featuredProducts.length > 0 && (	
				<FeaturedProductsSection
					categories={categories}
					products={featuredProducts}
				/>
			)}
			{sanitizeSanityStrings(controlSolutions?.visible) === "show" && controlSolutions?.features && controlSolutions.features.length > 0 && (
				<EnergyFeatures section={controlSolutions} />
			)}
			{sanitizeSanityStrings(trustedBy?.visible) === "show" && trustedBy?.logos && trustedBy.logos.length > 0 && (
				<TrustedBy section={trustedBy} />
			)}
			{sanitizeSanityStrings(about?.visible) === "show" && <AboutSection section={about} />}
		
			{projectsVisible && projects && projects.length > 0 && (
				<ProjectsSection projects={projects as ProjectsContent[]} projectsHeading={homePage?.projectsHeading} projectsSubheading={homePage?.projectsSubheading} />
			)}
			{testimonialsVisible && testimonials && testimonials.length > 0 && (
				<TestimonialsSection testimonials={testimonials} />
			)}
			{faqVisible && <FaqSection faq={faq} />}
			{ctaVisible && <CTASection cta={cta} />}
		</div>
	);
}
