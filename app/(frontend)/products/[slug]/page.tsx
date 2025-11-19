import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PRODUCT_QUERY } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import SingleProductWrapper from "@/components/products/single-product-wrapper";
import type { PRODUCT_QUERYResult } from "@/sanity.types";

type Props = {
	params: Promise<{ slug: string }>;
};

const productSlugs = defineQuery(
	`*[_type == "product" && defined(slug.current)]{"slug": slug.current}`
);

export async function generateStaticParams() {
	return await sanityFetch({
		query: productSlugs,
		perspective: "published",
		stega: false,
	});
}

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const product = await sanityFetch({
		query: PRODUCT_QUERY,
		params,
		stega: false,
	});
	const previousImages = (await parent).openGraph?.images || [];
	const ogImage = product?.images?.[0]
		? resolveOpenGraphImage(product.images[0].image)
		: undefined;

	return {
		title: product?.title,
		description: product?.shortDescription,
		openGraph: {
			images: ogImage ? [ogImage, ...previousImages] : previousImages,
		},
	} satisfies Metadata;
}

export default async function ProductPage({ params }: Props) {
	const [product] = await Promise.all([
		sanityFetch({ query: PRODUCT_QUERY, params }),
	]);

	if (!product?._id) {
		return notFound();
	}

	// Convert undefined back to null to match PRODUCT_QUERYResult type
	const productWithNulls = {
		...product,
		title: product.title ?? null,
		slug: product.slug ?? null,
		sku: product.sku ?? null,
		shortDescription: product.shortDescription ?? null,
	} as NonNullable<PRODUCT_QUERYResult>;

	return <SingleProductWrapper product={productWithNulls} />;
}
