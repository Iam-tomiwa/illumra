import "../globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { Inter } from "next/font/google";
import Navbar from "@/components/nav";
import { Footer } from "@/components/footer";
import Providers from "./providers";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  categoryQuery,
  legalSlugsQuery,
  settingsQuery,
} from "@/sanity/lib/queries";
import { seoToMetadata } from "@/sanity/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { CategoryType } from "@/components/home-widgets/featured-products-section";
import { SettingsQueryResult } from "@/sanity.types";
import { Head } from "next/document";

export async function generateMetadata(): Promise<Metadata> {
  // Fetch settings to get SEO configuration
  const settings = (await sanityFetch({
    query: settingsQuery,
    revalidate: 3600, // 1 hour
  })) as SettingsQueryResult | null;

  // Convert SEO data to Next.js Metadata format
  const metadata = seoToMetadata(settings?.seo);

  // Fallback to defaults if SEO is not configured
  if (!metadata.title || !metadata.description) {
    return {
      ...metadata,
      metadataBase: metadata.metadataBase || new URL("https://illumra.com"),
      title: metadata.title || {
        template: "%s | Illumra",
        default: "Illumra",
      },
      description:
        metadata.description ||
        "Revolutionary wireless control solutions for commercial and industrial lighting and HVAC systems. Reduce energy costs by up to 20% with intelligent automation.",
      openGraph: {
        ...metadata.openGraph,
        type: "website",
        locale: metadata.openGraph?.locale || "en_US",
        siteName: metadata.openGraph?.siteName || "Illumra",
      },
      twitter: metadata.twitter || {
        card: "summary_large_image",
      },
    };
  }

  return metadata;
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  // Categories are relatively static, so we use a longer revalidation time (1 hour)
  const categories = await sanityFetch({
    query: categoryQuery,
    revalidate: 3600, // 1 hour
  });
  // Settings are relatively static, so we use a longer revalidation time (1 hour)
  const settings = (await sanityFetch({
    query: settingsQuery,
  })) as SettingsQueryResult | null;

  const legalSlugs = await sanityFetch({
    query: legalSlugsQuery,
    revalidate: 3600,
  });

  return (
    <html lang="en" className={`${inter.variable} bg-white text-black`}>
      {/* <!-- Google tag (gtag.js) --> */}
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-M534TM7TC9"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M534TM7TC9');
          `,
        }}
      />
      <body>
        <Providers>
          <section className="min-h-screen">
            <Navbar isDraftMode={isDraftMode} settings={settings} />
            <main>{children}</main>
            <Footer
              categories={
                categories.map((category) => ({
                  ...category,
                  slug: category.slug ?? null,
                  title: category.title ?? null,
                  description: category.description ?? null,
                })) as CategoryType[]
              }
              legalSlugs={legalSlugs}
            />
            {isDraftMode && <VisualEditing />}
          </section>
          <SpeedInsights />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
