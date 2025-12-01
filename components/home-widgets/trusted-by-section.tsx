"use client";

import Image from "next/image";
import Link from "next/link";
import Marquee from "react-fast-marquee";

import { trustedBySection } from "@/sanity/lib/demo";
import type { HomePageQueryResult, MediaAsset } from "@/sanity.types";
import { resolveMediaAsset } from "@/sanity/lib/utils";

type TrustedByContent = NonNullable<
	NonNullable<HomePageQueryResult>["trustedBy"]
>;

type Logo = NonNullable<TrustedByContent["logos"]>[number];

export type ImageType = {
	name?: string;
	src: string;
	alt: string;
	href?: string;
};

type TrustedByProps = {
	section?: TrustedByContent | null;
};

const mapLogo = (logo: Logo): ImageType | undefined => {
	const resolved = resolveMediaAsset(
		logo.logo
			? {
					...(logo.logo as MediaAsset),
					_type: "mediaAsset",
				}
			: undefined
	);

	if (!resolved?.url) {
		return undefined;
	}

	return {
		name: logo.name ?? "Brand",
		src: resolved.url,
		alt: resolved.alt ?? logo.name ?? "Partner logo",
		href: logo.href ?? undefined,
	};
};

const mapLogos = (logos?: Logo[] | null): ImageType[] =>
	(logos ?? []).map(mapLogo).filter((logo): logo is ImageType => Boolean(logo));

const getLogos = (logos?: Logo[] | null): ImageType[] => {
	const resolved = mapLogos(logos);
	const fallbackLogos = trustedBySection.logos as Logo[];
	return resolved.length === 0 ? mapLogos(fallbackLogos) : resolved;
};

export default function TrustedBy({ section }: TrustedByProps) {
	const content = section ?? (trustedBySection as TrustedByContent);
	const logos = getLogos(content.logos);

	return (
		<section className="bg-accent py-10 pb-20">
			<div className="container mx-auto px-4 text-center">
				<div className="mb-6 flex items-center justify-center gap-6">
					<span className="h-px w-16 bg-primary/30" />
					{content.heading ? (
						<p className="text-sm font-medium uppercase tracking-wide text-foreground/70">
							{content.heading}
						</p>
					) : null}
					<span className="h-px w-16 bg-primary/30" />
				</div>

				<Marquee
					autoFill
					pauseOnHover
					gradient
					gradientColor="var(--accent)"
					gradientWidth={100}
				>
					{logos.map(logo => (
						<div
							key={`${logo.name}-${logo.src}`}
							className="mx-6 flex min-h-12 items-center justify-center"
						>
							{logo.href ? (
								<Link href={logo.href} target="_blank" rel="noreferrer noopener">
									<Image
										src={logo.src}
										alt={logo.alt}
										width={180}
										height={90}
										className="max-h-10 w-full object-contain md:h-20"
										unoptimized={logo.src.includes("cdn.sanity.io")}
									/>
								</Link>
							) : (
								<Image
									src={logo.src}
									alt={logo.alt}
									width={180}
									height={90}
									className="max-h-10 w-max"
									unoptimized={logo.src.includes("cdn.sanity.io")}
								/>
							)}
						</div>
					))}
				</Marquee>
			</div>
		</section>
	);
}
