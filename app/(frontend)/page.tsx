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
import type { HomePageQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
	categoryQuery,
	featuredProductsQuery,
	homePageQuery,
} from "@/sanity/lib/queries";

export default async function WirelessControlSolutionsLandingPage() {
	const homePage = (await sanityFetch({
		query: homePageQuery,
	})) as HomePageQueryResult;
	const hero = homePage?.hero ?? undefined;
	const controlSolutions = homePage?.controlSolutions ?? undefined;
	const trustedBy = homePage?.trustedBy ?? undefined;
	const about = homePage?.about ?? undefined;

	const featuredProducts = await sanityFetch({ query: featuredProductsQuery });
	const categories = await sanityFetch({ query: categoryQuery });

	return (
		<div className="min-h-screen bg-background text-foreground">
			<HeroSection hero={hero} />
			<EnergyFeatures section={controlSolutions} />
			{/* <WhyChooseSection /> */}
			<TrustedBy section={trustedBy} />
			<AboutSection section={about} />
			<FeaturedProductsSection
				categories={categories}
				products={featuredProducts}
			/>
			<ProjectsSection />
			<TestimonialsSection />
			<FaqSection />
			<CTASection />
		</div>
	);
}
