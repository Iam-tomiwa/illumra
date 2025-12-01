import "../globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { Inter } from "next/font/google";
import Navbar from "@/components/nav";
import { Footer } from "@/components/footer";
import Providers from "./providers";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryQuery } from "@/sanity/lib/queries";
import { Toaster } from "@/components/ui/sonner";
import { CategoryType } from "@/components/home-widgets/featured-products-section";

export async function generateMetadata(): Promise<Metadata> {
	const title = "Illumra";
	const description =
		"Revolutionary wireless control solutions for commercial and industrial lighting and HVAC systems. Reduce energy costs by up to 20% with intelligent automation.";

	const logoUrl =
		"https://res.cloudinary.com/tomiwadev/image/upload/v1764456817/image_2025-11-29_235333893_k8yazw.png";
	let metadataBase: URL | undefined = new URL("https://illumra.com");

	return {
		metadataBase,
		title: {
			template: `%s | ${title}`,
			default: title,
		},
		description: description,
		icons: {
			icon: logoUrl,
			apple: logoUrl,
		},
		openGraph: {
			type: "website",
			locale: "en_US",
			url: metadataBase,
			siteName: title,
			title: title,
			description: description,
			images: [
				{
					url: logoUrl,
					width: 1200,
					height: 627,
					alt: "Illumra Logo",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: title,
			description: description,
			images: [logoUrl],
		},
	};
}

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isEnabled: isDraftMode } = await draftMode();
	// Categories are relatively static, so we use a longer revalidation time (1 hour)
	const categories = await sanityFetch({
		query: categoryQuery,
		revalidate: 3600, // 1 hour
	});

	return (
		<html lang="en" className={`${inter.variable} bg-white text-black`}>
			<body>
				<Providers>
					<section className="min-h-screen">
						<Navbar isDraftMode={isDraftMode} />
						<main>{children}</main>
						<Footer
							categories={
								categories.map(category => ({
									...category,
									slug: category.slug ?? null,
									title: category.title ?? null,
									description: category.description ?? null,
								})) as CategoryType[]
							}
						/>
						{isDraftMode && <VisualEditing />}
					</section>
					<SpeedInsights />
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
