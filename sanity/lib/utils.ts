import createImageUrlBuilder from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/lib/api";
import type { MediaAsset } from "@/sanity.types";

const imageBuilder = createImageUrlBuilder({
	projectId: projectId || "",
	dataset: dataset || "",
});

/**
 * Removes hidden/special space characters only from the end of a string.
 * This includes zero-width spaces, non-breaking spaces, and other Unicode whitespace characters.
 * Characters in the middle of the string are preserved.
 */
export const cleanString = (value: string | undefined | null): string => {
	if (!value) return "";
	return (
		value
			// Remove zero-width characters at the end
			.replace(/[\u200B-\u200D\uFEFF]+$/g, "")
			// Remove non-breaking spaces and other special spaces at the end
			.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]+$/g, "")
			// Remove zero-width joiner and non-joiner at the end
			.replace(/[\u200C\u200D]+$/g, "")
			// Remove left-to-right and right-to-left marks at the end
			.replace(/[\u200E\u200F]+$/g, "")
			// Remove other invisible characters at the end
			.replace(/[\u2060-\u206F]+$/g, "")
			// Normalize Unicode characters
			.normalize("NFKC")
			// Trim regular whitespace at the end
			.trim()
	);
};

export const urlForImage = (source: any) => {
	// Ensure that source image contains a valid reference
	if (!source?.asset?._ref) {
		return undefined;
	}

	return imageBuilder?.image(source).auto("format").fit("max");
};

export function resolveOpenGraphImage(image: any, width = 1200, height = 627) {
	if (!image) return;
	const url = urlForImage(image)?.width(1200).height(627).fit("crop").url();
	if (!url) return;
	return { url, alt: image?.alt as string, width, height };
}

export function resolveHref(
	documentType?: string,
	slug?: string
): string | undefined {
	switch (documentType) {
		case "homePage":
			return "/";
		case "post":
			return slug ? `/posts/${slug}` : undefined;
		default:
			console.warn("Invalid document type:", documentType);
			return undefined;
	}
}

export type ResolveMediaAssetOptions = {
	width?: number;
	height?: number;
	fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
	quality?: number;
};

export type ResolvedMediaAsset = {
	url: string;
	alt?: string | null;
};

export function resolveMediaAsset(
	media: MediaAsset | undefined,
	options?: ResolveMediaAssetOptions
): ResolvedMediaAsset | undefined {
	if (!media) {
		return undefined;
	}

	const source = cleanString(media.source);

	if (source === "external" && media.externalUrl) {
		return {
			url: media.externalUrl,
			alt: media.altText ?? undefined,
		};
	}

	if (source === "upload" && media.image?.asset?._ref) {
		let builder = urlForImage(media.image);

		if (!builder) {
			return undefined;
		}

		if (options?.width) {
			builder = builder.width(options.width);
		}

		if (options?.height) {
			builder = builder.height(options.height);
		}

		if (options?.fit) {
			builder = builder.fit(options.fit);
		}

		if (options?.quality) {
			builder = builder.quality(options.quality);
		}

		const url = builder.url();
		if (!url) {
			return undefined;
		}

		return {
			url,
			alt: cleanString(media.altText) ?? undefined,
		};
	}

	return undefined;
}

/**
 * Converts SEO data from Sanity to Next.js Metadata format
 */
export function seoToMetadata(seo: {
	title?: string | null;
	titleTemplate?: string | null;
	description?: string | null;
	keywords?: Array<string | null> | string[] | null;
	siteUrl?: string | null;
	ogImage?: {
		source?: "external" | "upload" | string | null;
		altText?: string | null;
		externalUrl?: string | null;
		image?: {
			asset?: {
				_ref?: string;
				_type?: string;
				_weak?: boolean;
				[key: string]: unknown;
			} | null;
			crop?: unknown | null;
			hotspot?: unknown | null;
		} | null;
	} | null;
	favicon?: {
		source?: "external" | "upload" | string | null;
		altText?: string | null;
		externalUrl?: string | null;
		image?: {
			asset?: {
				_ref?: string;
				_type?: string;
				_weak?: boolean;
				[key: string]: unknown;
			} | null;
			crop?: unknown | null;
			hotspot?: unknown | null;
		} | null;
	} | null;
	twitterCard?: "app" | "player" | "summary_large_image" | "summary" | string | null;
	twitterSite?: string | null;
	twitterCreator?: string | null;
	locale?: string | null;
} | {
	title: string | null;
	titleTemplate: string | null;
	description: string | null;
	keywords: Array<string> | null;
	siteUrl: string | null;
	ogImage: {
		source: "external" | "upload" | null;
		altText: string | null;
		externalUrl: string | null;
		image: {
			asset: {
				_ref: string;
				_type: "reference";
				_weak?: boolean;
				[key: string]: unknown;
			} | null;
			crop: unknown | null;
			hotspot: unknown | null;
		} | null;
	} | null;
	favicon: {
		source: "external" | "upload" | null;
		altText: string | null;
		externalUrl: string | null;
		image: {
			asset: {
				_ref: string;
				_type: "reference";
				_weak?: boolean;
				[key: string]: unknown;
			} | null;
			crop: unknown | null;
			hotspot: unknown | null;
		} | null;
	} | null;
	twitterCard: "app" | "player" | "summary_large_image" | "summary" | null;
	twitterSite: string | null;
	twitterCreator: string | null;
	locale: string | null;
} | null | undefined): import("next").Metadata {
	if (!seo) {
		return {};
	}

	const metadataBase = seo.siteUrl ? new URL(seo.siteUrl) : undefined;
	const ogImage = resolveMediaAsset(seo.ogImage as any, { width: 1200, height: 627 });
	const favicon = resolveMediaAsset(seo.favicon as any);

	const keywordsString = seo.keywords
		?.filter((k): k is string => typeof k === "string" && k.length > 0)
		.join(", ");

	const metadata: import("next").Metadata = {
		...(metadataBase && { metadataBase }),
		...(seo.title && {
			title: {
				template: seo.titleTemplate || `%s | ${seo.title}`,
				default: seo.title,
			},
		}),
		...(seo.description && { description: seo.description }),
		...(keywordsString && { keywords: keywordsString }),
		...(favicon?.url && {
			icons: {
				icon: favicon.url,
				apple: favicon.url,
			},
		}),
		openGraph: {
			type: "website",
			...(seo.locale && { locale: seo.locale }),
			...(metadataBase && { url: metadataBase }),
			...(seo.title && { siteName: seo.title, title: seo.title }),
			...(seo.description && { description: seo.description }),
			...(ogImage?.url && {
				images: [
					{
						url: ogImage.url,
						width: 1200,
						height: 627,
						alt: ogImage.alt || "Social sharing image",
					},
				],
			}),
		},
		twitter: {
			...(seo.twitterCard && { card: seo.twitterCard as "summary" | "summary_large_image" | "app" | "player" }),
			...(seo.title && { title: seo.title }),
			...(seo.description && { description: seo.description }),
			...(ogImage?.url && { images: [ogImage.url] }),
			...(seo.twitterSite && { site: seo.twitterSite }),
			...(seo.twitterCreator && { creator: seo.twitterCreator }),
		},
	};

	return metadata;
}

/**
 * Merges page-specific SEO with settings SEO (page SEO takes precedence)
 */
export function mergeSeo(pageSeo: any, settingsSeo: any): any {
	if (!pageSeo && !settingsSeo) return null;
	if (!pageSeo) return settingsSeo;
	if (!settingsSeo) return pageSeo;

	// Page SEO takes precedence, but we merge fields that might be missing
	return {
		...settingsSeo,
		...pageSeo,
		// Only override ogImage if page has one, otherwise use settings
		ogImage: pageSeo.ogImage || settingsSeo.ogImage,
		// Only override favicon if page has one, otherwise use settings
		favicon: pageSeo.favicon || settingsSeo.favicon,
	};
}

/**
 * Recursively converts all `null` values in an object or array to `undefined`.
 */
type NullToUndefined<T> = T extends null
	? undefined
	: T extends Array<infer U>
		? Array<NullToUndefined<U>>
		: T extends object
			? { [K in keyof T]: NullToUndefined<T[K]> }
			: T;

export function normalizeNulls<T>(input: T): NullToUndefined<T> {
	if (input === null) return undefined as any;
	if (Array.isArray(input)) {
		return input.map(item => normalizeNulls(item)) as any;
	}
	if (typeof input === "object" && input !== undefined) {
		const result: any = {};
		for (const key in input) {
			if (Object.prototype.hasOwnProperty.call(input, key)) {
				const value = (input as any)[key];
				result[key] = value === null ? undefined : normalizeNulls(value);
			}
		}
		return result as NullToUndefined<T>;
	}
	return input as NullToUndefined<T>;
}

/**
 * Recursively sanitizes all string values in an object or array by removing hidden/special space characters.
 * This should be applied to Sanity data after fetching to ensure clean strings throughout the application.
 */
export function sanitizeStrings<T>(input: T): T {
	if (typeof input === "string") {
		return cleanString(input) as T;
	}
	if (Array.isArray(input)) {
		return input.map(item => sanitizeStrings(item)) as T;
	}
	if (typeof input === "object" && input !== null && input !== undefined) {
		const result: any = {};
		for (const key in input) {
			if (Object.prototype.hasOwnProperty.call(input, key)) {
				const value = (input as any)[key];
				result[key] = sanitizeStrings(value);
			}
		}
		return result as T;
	}
	return input;
}

/**
 * Combines normalizeNulls and sanitizeStrings for complete Sanity data cleanup.
 * Use this function to process all Sanity data after fetching.
 */
export function sanitizeSanityData<T>(input: T): NullToUndefined<T> {
	return sanitizeStrings(normalizeNulls(input)) as NullToUndefined<T>;
}

/**
 * Sanitizes strings only (removes hidden characters) without converting null to undefined.
 * Use this when you want to preserve Sanity's null types to match generated types.
 */
export function sanitizeSanityStrings<T>(input: T): T {
	return sanitizeStrings(input) as T;
}
