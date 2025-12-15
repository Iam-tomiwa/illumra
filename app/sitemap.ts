import { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { SettingsQueryResult } from "@/sanity.types";

// Query for all products with slugs and update dates
const productsQuery = `*[_type == "product" && defined(slug.current)]{
  "slug": slug.current,
  _updatedAt
} | order(_updatedAt desc)`;

// Query for all posts with slugs and update dates
const postsQuery = `*[_type == "post" && defined(slug.current)]{
  "slug": slug.current,
  _updatedAt
} | order(_updatedAt desc)`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Get base URL from settings
	const settings = (await sanityFetch({
		query: settingsQuery,
		revalidate: 3600,
	})) as SettingsQueryResult | null;

	const baseUrl = settings?.seo?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://illumra.com";

	// Static pages (always included)
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/case-studies`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/distributors`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/faq`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/products`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/posts`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.7,
		},
	];

	// Fetch dynamic pages
	const [products, posts] = await Promise.all([
		sanityFetch({
			query: productsQuery,
			perspective: "published",
			stega: false,
		}) as Promise<Array<{ slug: string; _updatedAt: string }> | null>,
		sanityFetch({
			query: postsQuery,
			perspective: "published",
			stega: false,
		}) as Promise<Array<{ slug: string; _updatedAt: string }> | null>,
	]);

	// Product pages
	const productPages: MetadataRoute.Sitemap =
		products?.map(product => ({
			url: `${baseUrl}/products/${product.slug}`,
			lastModified: new Date(product._updatedAt),
			changeFrequency: "weekly" as const,
			priority: 0.8,
		})) || [];

	// Post pages
	const postPages: MetadataRoute.Sitemap =
		posts?.map(post => ({
			url: `${baseUrl}/posts/${post.slug}`,
			lastModified: new Date(post._updatedAt),
			changeFrequency: "monthly" as const,
			priority: 0.6,
		})) || [];

	// Combine all pages
	return [...staticPages, ...productPages, ...postPages];
}

