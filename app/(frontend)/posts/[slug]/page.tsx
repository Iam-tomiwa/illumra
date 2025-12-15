import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Avatar from "@/components/resolved-avatar";
import CoverImage from "@/components/cover-image";
import DateComponent from "@/components/date";
import MoreStories from "@/components/more-stories";
import PortableText from "@/components/portable-text";

import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postQuery, settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage, seoToMetadata, mergeSeo } from "@/sanity/lib/utils";
import { MediaAsset } from "@/sanity.types";
import ReadingTime from "@/components/blog/reading-time";

type Props = {
	params: Promise<{ slug: string }>;
};

const postSlugs = defineQuery(
	`*[_type == "post" && defined(slug.current)]{"slug": slug.current}`
);

export async function generateStaticParams() {
	return await sanityFetch({
		query: postSlugs,
		perspective: "published",
		stega: false,
	});
}

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const [post, settings] = await Promise.all([
		sanityFetch({
			query: postQuery,
			params,
			stega: false,
		}),
		sanityFetch({
			query: settingsQuery,
			revalidate: 3600,
		}),
	]);

	// Merge post SEO with settings SEO
	const mergedSeo = mergeSeo(post?.seo, settings?.seo);
	const metadata = seoToMetadata(mergedSeo);

	const previousImages = (await parent).openGraph?.images || [];
	const ogImage = resolveOpenGraphImage(post?.coverImage);

	// Override with post-specific data
	return {
		...metadata,
		authors: post?.author?.name ? [{ name: post?.author?.name }] : [],
		title: post?.seo?.title
			? {
				template: post.seo.titleTemplate || mergedSeo?.titleTemplate || "%s | Illumra",
				default: post.seo.title,
			}
			: post?.title || metadata.title,
		description: post?.seo?.description || post?.excerpt || metadata.description,
		openGraph: {
			...metadata.openGraph,
			images: ogImage ? [ogImage, ...previousImages] : previousImages,
		},
	} satisfies Metadata;
}

export default async function PostPage({ params }: Props) {
	const [post, settings] = await Promise.all([
		sanityFetch({ query: postQuery, params }),
		sanityFetch({ query: settingsQuery }),
	]);

	if (!post?._id) {
		return notFound();
	}

	return (
		<div className="container mx-auto px-5 pt-24">
			<article>
				<h1 className="text-balance mb-12 text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-7xl">
					{post.title}
				</h1>
				<div className="hidden md:mb-12 md:block">
					{post.author && (
						<Avatar
							name={post.author.name}
							picture={post.author.picture as MediaAsset}
						/>
					)}
				</div>
				<div className="mb-8 sm:mx-0 md:mb-16">
					<CoverImage image={post.coverImage} priority />
				</div>
				<div className="mx-auto max-w-2xl">
					<div className="mb-6 block md:hidden">
						{post.author && (
							<Avatar
								name={post.author.name}
								picture={post.author.picture as MediaAsset}
							/>
						)}
					</div>
					<div className="mb-6 text-lg">
						<div className="mb-4 text-lg flex items-center gap-2">
							<DateComponent dateString={post.date} /> - <ReadingTime className="text-accent-foreground italic"
							 content={post.content as PortableTextBlock[]} />
						</div>
					</div>
				</div>
				{post.content?.length && (
					<PortableText
						className="mx-auto max-w-2xl"
						value={post.content as PortableTextBlock[]}
					/>
				)}
			</article>
			<aside>
				<hr className="border-accent-2 mb-24 mt-28" />
				<h2 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
					Recent Stories
				</h2>
				<Suspense>
					<MoreStories skip={post._id} limit={2} />
				</Suspense>
			</aside>
		</div>
	);
}
