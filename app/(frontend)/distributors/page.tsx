import BecomeADistributor from "@/components/about/become-a-distributor";
import BecomeARep from "@/components/about/become-a-rep";
import { AnimatedElement } from "@/components/animated-element";
import PagesHero from "@/components/pages-hero";
import StoreLocator, { StoreInput } from "@/components/store-locator/store-locator";
import { sanityFetch } from "@/sanity/lib/fetch";
import { STORES_QUERY, distributorsPageQuery } from "@/sanity/lib/queries";
import { resolveBackgroundUrl } from "@/components/home-widgets/hero-section";

export default async function DistributorsPage() {
	const [stores, distributorsPage] = await Promise.all([
		sanityFetch({ query: STORES_QUERY }),
		sanityFetch({ query: distributorsPageQuery }),
	]);

	// Resolve background image
	const backgroundImage = resolveBackgroundUrl(
		distributorsPage?.backgroundImage as Parameters<typeof resolveBackgroundUrl>[0]
	)?.url;

	const storesList: StoreInput[] = Array.isArray(stores)
		? stores
				.filter(
					(store) =>
						store !== null &&
						typeof store.name === "string" &&
						typeof store.storeType === "string" &&
						["distributor", "rep", "retailer"].includes(store.storeType) &&
						typeof store.address === "string" &&
						typeof store.city === "string" &&
						typeof store.country === "string"
				)
				.map((store) => ({
					_id: store._id,
					name: store.name!,
					storeType: store.storeType as "distributor" | "rep" | "retailer",
					address: store.address!,
					city: store.city!,
					state: store.state,
					zipCode: store.zipCode,
					country: store.country!,
					phone: store.phone,
					email: store.email,
					website: store.website,
					location: store.location
						? { lat: store.location.lat!, lng: store.location.lng! }
						: null,
				}))
		: [];

	return (
		<div className="bg-accent">
			<PagesHero backgroundImageUrl={backgroundImage}>
				<div className="max-w-3xl">
					<AnimatedElement delay={0.1}>
						<h1 className="page-title">{distributorsPage?.pageTitle || "Where to Buy"}</h1>
					</AnimatedElement>
					{distributorsPage?.description && (
						<AnimatedElement delay={0.2}>
							<p className="mb-6 text-white">{distributorsPage.description}</p>
						</AnimatedElement>
					)}
					{!distributorsPage?.description && (
						<AnimatedElement delay={0.2}>
							<p className="mb-6">
								Discover local distributors with ease! Simply search by city, state,
								or ZIP code, or use the &quot;Near Me&quot; button to find the
								closest distributors to your location. We&apos;re here to help you
								connect with the best options available.
							</p>
						</AnimatedElement>
					)}
				</div>
			</PagesHero>

			<div className="container mx-auto px-4 py-12">
				<StoreLocator stores={storesList} />

				{/* Become a Distributor Section */}
				<div className="mt-16">
					<BecomeADistributor className="bg-transparent py-0" />
					<BecomeARep className="bg-transparent py-8" />
				</div>
			</div>
		</div>
	);
}
