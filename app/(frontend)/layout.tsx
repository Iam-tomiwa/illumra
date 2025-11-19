import "../globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { Inter } from "next/font/google";
import AlertBanner from "@/components/alert-banner";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import Navbar from "@/components/nav";
import { Footer } from "@/components/footer";
import Providers from "./providers";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryQuery } from "@/sanity/lib/queries";
import { Toaster } from "@/components/ui/sonner";

export async function generateMetadata(): Promise<Metadata> {
	const title = "Illumra";
	const description =
		"Revolutionary wireless control solutions for commercial and industrial lighting and HVAC systems. Reduce energy costs by up to 20% with intelligent automation.";

	const ogImage = resolveOpenGraphImage("");
	let metadataBase: URL | undefined = new URL("https://illumra.com");

	return {
		metadataBase,
		title: {
			template: `%s | ${title}`,
			default: title,
		},
		description: description,
		openGraph: {
			images: ogImage ? [ogImage] : [],
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
	const categories = await sanityFetch({ query: categoryQuery });

	return (
		<html lang="en" className={`${inter.variable} bg-white text-black`}>
			<body>
				<Providers>
					<section className="min-h-screen">
						{isDraftMode && <AlertBanner />}
						<Navbar className={isDraftMode ? "mt-9 top-9" : ""} />
						<main>{children}</main>
						<Footer categories={categories} />
						{isDraftMode && <VisualEditing />}
					</section>
					<SpeedInsights />
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
