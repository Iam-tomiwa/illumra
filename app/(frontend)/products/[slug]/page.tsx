import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  PRODUCT_QUERY,
  relevantProductsQuery,
  settingsQuery,
} from "@/sanity/lib/queries";
import {
  mergeSeo,
  resolveOpenGraphImage,
  seoToMetadata,
} from "@/sanity/lib/utils";
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
  const [product, settings] = await Promise.all([
    sanityFetch({
      query: PRODUCT_QUERY,
      params,
      stega: false,
    }),
    sanityFetch({
      query: settingsQuery,
      revalidate: 3600,
    }),
  ]);

  // Merge product SEO with settings SEO
  const mergedSeo = mergeSeo(product?.seo, settings?.seo);
  const metadata = seoToMetadata(mergedSeo);

  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = product?.images?.[0]
    ? resolveOpenGraphImage(product.images[0].image)
    : undefined;

  // Override with product-specific data
  return {
    ...metadata,
    title: product?.seo?.title
      ? {
          template:
            product.seo.titleTemplate ||
            mergedSeo?.titleTemplate ||
            "%s | Illumra",
          default: product.seo.title,
        }
      : `${product?.title}`,
    description:
      product?.seo?.description ||
      product?.shortDescription ||
      metadata.description,
    openGraph: {
      ...metadata.openGraph,
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
    }).then(async (product) => {
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
