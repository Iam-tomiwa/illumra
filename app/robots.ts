import { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { SettingsQueryResult } from "@/sanity.types";

export default async function robots(): Promise<MetadataRoute.Robots> {
	const settings = (await sanityFetch({
		query: settingsQuery,
		revalidate: 3600,
	})) as SettingsQueryResult | null;

	const baseUrl = settings?.seo?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://illumra.com";

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/studio/", "/api/"],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}

