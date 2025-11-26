import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PRODUCT_QUERY, relevantProductsQuery } from "@/sanity/lib/queries";
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
	const [product, relevantProducts] = await Promise.all([
		sanityFetch({ query: PRODUCT_QUERY, params }),
		sanityFetch({
			query: PRODUCT_QUERY,
			params,
		}).then(async product => {
			if (!product?._id || !product?.category?.slug) {
				return [];
			}
			return sanityFetch({
				query: relevantProductsQuery,
				params: {
					category: product.category.slug,
					excludeId: product._id,
				},
			});
		}),
	]);

	if (!product?._id) {
		return notFound();
	}

	return (
		<SingleProductWrapper
			product={product as NonNullable<PRODUCT_QUERYResult>}
			relevantProducts={relevantProducts || []}
		/>
	);
}
