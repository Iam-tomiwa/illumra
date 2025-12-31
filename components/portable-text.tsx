/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";

import { resolveMediaAsset } from "@/sanity/lib/utils";
import { MediaAsset, VideoAsset } from "@/sanity.types";
import { VideoEmbed } from "@/components/products/video-embed";

interface ContentImageValue {
  _type: "contentImage";
  _key: string;
  media?: MediaAsset;
  caption?: string;
}

interface VideoAssetValue extends Omit<VideoAsset, "_type"> {
  _type: "videoAsset";
  _key: string;
}

export default function CustomPortableText({
  className,
  value,
}: {
  className?: string;
  value: PortableTextBlock[];
}) {
  const components: PortableTextComponents = {
    block: {
      h5: ({ children }) => (
        <h5 className="mb-2 text-sm font-semibold">{children}</h5>
      ),
      h6: ({ children }) => (
        <h6 className="mb-1 text-xs font-semibold">{children}</h6>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        return (
          <a href={value?.href} className="px-1" rel="noreferrer noopener">
            {children}
          </a>
        );
      },
    },
    types: {
      contentImage: ({ value }: { value: ContentImageValue }) => {
        const resolved = resolveMediaAsset(value.media, { width: 1200 });

        if (!resolved?.url) {
          return null;
        }

        return (
          <figure className="my-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full rounded-lg"
              src={resolved.url}
              alt={resolved.alt || ""}
              loading="lazy"
            />
            {value.caption && (
              <figcaption className="mt-2 text-center text-sm text-gray-500">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
      videoAsset: ({ value }: { value: VideoAssetValue }) => {
        if (!value.externalUrl) {
          return null;
        }

        return (
          <figure className="my-8">
            <div className="aspect-video rounded-lg overflow-hidden">
              <VideoEmbed
                url={value.externalUrl}
                title={value.title}
                className="rounded-lg"
              />
            </div>
            {value.title && (
              <figcaption className="mt-2 text-center text-sm text-gray-500">
                {value.title}
              </figcaption>
            )}
          </figure>
        );
      },
    },
  };

  return (
    <div className={["prose", className].filter(Boolean).join(" ")}>
      <PortableText components={components} value={value} />
    </div>
  );
}
