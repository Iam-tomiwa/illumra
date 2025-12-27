import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import { AnimatedElement } from "@/components/animated-element";
import PagesHero from "@/components/pages-hero";
import PortableText from "@/components/portable-text";

import { sanityFetch } from "@/sanity/lib/fetch";
import {
  legalQuery,
  legalSlugsQuery,
  settingsQuery,
} from "@/sanity/lib/queries";
import { mergeSeo, seoToMetadata } from "@/sanity/lib/utils";
import type { LegalQueryResult, SettingsQueryResult } from "@/sanity.types";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return await sanityFetch({
    query: legalSlugsQuery,
    perspective: "published",
    stega: false,
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [legalDoc, settings] = (await Promise.all([
    sanityFetch({
      query: legalQuery,
      params,
      stega: false,
    }),
    sanityFetch({
      query: settingsQuery,
      revalidate: 3600,
    }),
  ])) as [LegalQueryResult | null, SettingsQueryResult | null];

  if (!legalDoc?._id) {
    return {};
  }

  // Merge legal document SEO with settings SEO
  const mergedSeo = mergeSeo(legalDoc?.seo, settings?.seo);
  const metadata = seoToMetadata(mergedSeo);

  // Override with document-specific data
  return {
    ...metadata,
    title: legalDoc?.seo?.title
      ? {
          template:
            legalDoc.seo.titleTemplate ||
            mergedSeo?.titleTemplate ||
            "%s | Illumra",
          default: legalDoc.seo.title,
        }
      : legalDoc?.title || metadata.title,
    description: legalDoc?.seo?.description || metadata.description,
  } satisfies Metadata;
}

export default async function LegalDocumentPage({ params }: Props) {
  const legalDoc = (await sanityFetch({
    query: legalQuery,
    params,
  })) as LegalQueryResult | null;

  if (!legalDoc?._id) {
    return notFound();
  }

  return (
    <div className="bg-white">
      <PagesHero>
        <div className="max-w-3xl">
          <AnimatedElement delay={0.1}>
            <h1 className="page-title">{legalDoc.title}</h1>
            {legalDoc._updatedAt && (
              <p className="text-white/80 text-sm uppercase tracking-wide mt-2">
                Last updated:{" "}
                {new Date(legalDoc._updatedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </AnimatedElement>
        </div>
      </PagesHero>
      <div className="container px-4 mx-auto py-12">
        <div className="max-w-3xl mx-auto">
          {legalDoc.content?.length && (
            <PortableText value={legalDoc.content as PortableTextBlock[]} />
          )}
        </div>
      </div>
    </div>
  );
}
