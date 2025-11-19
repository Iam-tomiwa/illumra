import BecomeADistributor from "@/components/about/become-a-distributor";
import BecomeARep from "@/components/about/become-a-rep";
import PagesHero from "@/components/pages-hero";
import { Separator } from "@/components/ui/separator";

export default function DistributorsPage() {
	return (
		<div className="bg-accent">
			<PagesHero>
				<div className="max-w-3xl">
					<p className="text-primary mb-4">Find a Rep/Distributor</p>
					<h1 className="page-title">Where to Buy</h1>
					<p className="mb-6">
						Discover local distributors with ease! Simply enter your zip code or
						address in the provided field, and a detailed map will display all the
						distributors in area. If you don&apos;t find one nearby, don’t hesitate to
						reach out to us for assistance. We&apos;re here to help you connect with
						best options available
					</p>
				</div>
			</PagesHero>
			<div className="container flex flex-col items-center mx-auto gap-4 px-4 py-20">
				<iframe
					className="nKphmK w-3/5 h-full aspect-square rounded-lg"
					title="Store Locator &amp; Map"
					aria-label="Store Locator &amp; Map"
					scrolling="no"
					src="https://store-locator.zend-apps.com/locator?pageId=ydvna&amp;compId=comp-mggo46e7&amp;viewerCompId=comp-mggo46e7&amp;siteRevision=52&amp;viewMode=site&amp;deviceType=desktop&amp;locale=en&amp;tz=America%2FDenver&amp;regionalLanguage=en&amp;width=980&amp;height=723&amp;instance=NAbQUIRkJe0WbZ-dldWoDZO4CLeb1g47hfeeSzg4owY.eyJpbnN0YW5jZUlkIjoiZTBkYjkyOGQtZDFlOC00NTcxLTk0YzMtNzkwMjk1Njg5ZmY3IiwiYXBwRGVmSWQiOiIyOTYxMmQwNi1hZGY4LTQ1YjMtOTA4Ny04MDE2NWRlZTY2NDUiLCJzaWduRGF0ZSI6IjIwMjUtMTEtMDRUMjI6NTc6MDIuMDYyWiIsInZlbmRvclByb2R1Y3RJZCI6InByZW1pdW0iLCJkZW1vTW9kZSI6ZmFsc2UsImFpZCI6ImRjMGZhOWVhLTYwNTEtNGRjYi1hOTIxLTI5Nzc1Mzg5NDZiNiIsInNpdGVPd25lcklkIjoiMTQxMWFiYTYtYWFjMy00ZjJlLWExNzEtYjU1MzAzYjIwZDVjIiwic2NkIjoiMjAyNS0wOS0wOFQxNjoxNTo0MS43NjVaIiwiYWNkIjoiMjAyNS0wOS0wOFQxNTozOTowM1oifQ&amp;currency=USD&amp;currentCurrency=USD&amp;commonConfig=%7B%22brand%22%3A%22wix%22%2C%22host%22%3A%22VIEWER%22%2C%22bsi%22%3A%22f50faaf0-2f2d-4e49-8a2d-5994bb6840da%7C2%22%2C%22siteRevision%22%3A%2252%22%2C%22renderingFlow%22%3A%22FEEDBACK%22%2C%22language%22%3A%22en%22%2C%22locale%22%3A%22en-us%22%2C%22BSI%22%3A%22f50faaf0-2f2d-4e49-8a2d-5994bb6840da%7C2%22%7D&amp;currentRoute=.%2Fwhere-to-buy&amp;vsi=2ee5ff8e-d7d2-464f-9b0e-8e8b1f03463a"
					allowFullScreen
					allowTransparency
					allow="clipboard-write;autoplay;camera;microphone;geolocation;vr"
				></iframe>

				{/* Become a Distributor Section */}
				<div>
					<BecomeADistributor className="bg-transparent py-0 pt-20" />
					<BecomeARep className="bg-transparent py-8" />
				</div>
			</div>
		</div>
	);
}
