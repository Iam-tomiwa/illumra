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
