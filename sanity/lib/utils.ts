import createImageUrlBuilder from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/lib/api";
import type { MediaAsset } from "@/sanity.types";

const imageBuilder = createImageUrlBuilder({
	projectId: projectId || "",
	dataset: dataset || "",
});

export const cleanString = (value: string | undefined | null): string =>
	(value ?? "")
		.replace(/[\u200B-\u200D\uFEFF]/g, "")
		.normalize("NFKC")
		.trim();

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
