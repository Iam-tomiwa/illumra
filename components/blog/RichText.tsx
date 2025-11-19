/* eslint-disable @next/next/no-img-element */
import {
	PortableText,
	type PortableTextComponents,
	type PortableTextBlock,
} from "next-sanity";

import { urlForImage } from "@/sanity/lib/utils";

const components: PortableTextComponents = {
	types: {
		image: ({ value }: { value: any }) => {
			if (!value?.asset?._ref) {
				return null;
			}
			const imageBuilder = urlForImage(value);
			if (!imageBuilder) {
				return null;
			}
			const url = imageBuilder.width(1200).height(675).fit("max").url();
			if (!url) {
				return null;
			}
			return (
				<figure className="my-8 overflow-hidden rounded-2xl border">
					<img src={url} alt={value.alt ?? ""} className="w-full object-cover" />
					{value.alt && (
						<figcaption className="bg-muted px-4 py-2 text-sm text-muted-foreground">
							{value.alt}
						</figcaption>
					)}
				</figure>
			);
		},
	},
	block: {
		h2: ({ children }) => (
			<h2 className="mt-10 text-3xl font-semibold tracking-tight">{children}</h2>
		),
		h3: ({ children }) => (
			<h3 className="mt-8 text-2xl font-semibold tracking-tight">{children}</h3>
		),
		blockquote: ({ children }) => (
			<blockquote className="border-l-4 border-primary/50 pl-6 italic text-lg font-medium text-muted-foreground">
				{children}
			</blockquote>
		),
	},
	list: {
		bullet: ({ children }) => (
			<ul className="ml-5 list-disc space-y-2">{children}</ul>
		),
		number: ({ children }) => (
			<ol className="ml-5 list-decimal space-y-2">{children}</ol>
		),
	},
	marks: {
		link: ({ children, value }) => {
			const href = value?.href || "";
			const isExternal = href.startsWith("http");
			return (
				<a
					href={href}
					className="font-semibold text-primary underline-offset-2 hover:underline"
					target={isExternal ? "_blank" : undefined}
					rel={isExternal ? "noopener noreferrer" : undefined}
				>
					{children}
				</a>
			);
		},
	},
};

interface RichTextProps {
	value: PortableTextBlock[];
}

export function RichText({ value }: RichTextProps) {
	return (
		<div className="prose prose-lg prose-neutral max-w-none dark:prose-invert">
			<PortableText value={value} components={components} />
		</div>
	);
}
